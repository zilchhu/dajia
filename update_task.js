import fs from "fs"
import util from "util"
import pLimit from "p-limit"
import pMap from "p-map"
import sleep from "sleep-promise"
import dayjs from "dayjs"
import xls2Json from "xls-to-json"
import apprun from "apprun"
import knx from "../50/index.js"
import { updateTagPlan, updateSpuPlan, substituteSpuPlan, tryCreateTestFoods, tryDeleteTestFoods } from "./test2.js"
import { updateCatePlan, updateFoodPlan } from "../20/elm/test.js"

const app = apprun.app

const axls2Json = util.promisify(xls2Json)

const baseUrl = "http://localhost:11180/"

const groupBy = (arr, key) => {
  let uniqs = [...new Set(arr.map(v => v[key]))]
  return uniqs.map(v => {
    return {
      group: v,
      members: arr.filter(k => k[key] == v),
    }
  })
}

async function readXls(path, sheet) {
  try {
    let res = await axls2Json({
      input: `${path}`,
      sheet,
      output: null,
    })
    return res
  } catch (err) {
    console.error(err)
    return []
  }
}

let tasks = {}

let transformers = {
  asString(value, msg) {
    if (value == null) throw new Error(msg)
    if (typeof value == "string") {
      value = value.trim()
      if (value == "") throw new Error(msg)
      return value
    }
    throw new Error(msg)
  },
  asOptString(value, msg) {
    if (value == null) return null
    if (typeof value == "string") {
      value = value.trim()
      if (value == "") return null
      return value
    }
    return null
  },
  asNumber(value, msg) {
    if (value == null) throw new Error(msg)
    if (typeof value == "number") {
      if (isNaN(value)) throw new Error(msg)
      return value
    }
    if (typeof value == "string") {
      let str = this.asString(value, msg)
      let num = parseFloat(str)
      return this.asNumber(num, msg)
    }
    throw new Error(msg)
  },
  asOptNumber(value, msg) {
    if (value == null) return null
    if (typeof value == "number") {
      if (isNaN(value)) return null
      return value
    }
    if (typeof value == "string") {
      let str = this.asOptString(value, msg)
      let num = parseFloat(str)
      return this.asOptNumber(num, msg)
    }
    return null
  },
  asInt(value, msg) {
    if (value == null) throw new Error(msg)
    let num = this.asNumber(value, msg)
    let int = Math.floor(num)
    return int
  },
  asOptInt(value, msg) {
    let num = this.asOptNumber(value, msg)
    if (num == null) return null
    return Math.floor(num)
  },
  asPosInt(value, msg) {
    if (value == null) throw new Error(msg)
    let int = this.asInt(value, msg)
    if (int <= 0) throw new Error(msg)
    return int
  },
  asOptPosInt(value, msg) {
    let int = this.asOptInt(value, msg)
    if (int == null) return null
    if (int <= 0) return null
    return int
  },
  asID(value, msg) {
    if (value == null) throw new Error(msg)
    if (typeof value == "string") {
      let str = this.asString(value, msg)
      if (str.match(/\d+/)) return value
      throw new Error(msg)
    }
    if (typeof value == "number") {
      return this.asPosInt(value, msg)
    }
    throw new Error(msg)
  },
  asOptID(value, msg) {
    if (value == null) return null
    if (typeof value == "string") {
      let str = this.asOptString(value, msg)
      if (str == null) return null
      if (str.match(/\d+/)) return value
      return null
    }
    if (typeof value == "number") {
      return this.asOptInt(value, msg)
    }
    return null
  },
}

const send = (ws, msg) => {
  ws.send(JSON.stringify(msg))
}

const broadcast = (wss, msg) => {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(msg))
    }
  })
}

const collectResult = (wss, res) => {
  tasks[res.id].results.push(res)
  broadcast(wss, {
    event: "exec-task-res",
    state: res,
  })
  return res
}

const makeStatusAndTitle = results => {
  let errors = results.filter(v => v.error != null)
  if (errors.length == 0)
    return {
      status: "全部成功",
      title: `全部成功(${results.length}/${results.length})`,
    }
  if (errors.length == results.length)
    return {
      status: "全部失败",
      title: `全部失败(0/${results.length})`,
    }
  return {
    status: "部分成功",
    title: `部分成功(${results.length - errors.length}/${results.length})`,
  }
}

const onProcessing = async (wss, id) => {
  await knx("test_task_")
    .where({ id })
    .update({ status: "进行中" })

  broadcast(wss, {
    event: "food-task-status",
    id,
    status: "进行中",
  })
}

const onException = async (wss, id) => {
  await knx("test_task_")
    .where({ id })
    .update({ status: "异常" })

  broadcast(wss, {
    event: "food-task-status",
    id,
    status: "异常",
  })
}

const onFinished = async (wss, id, results, filename, output) => {
  let { status, title } = makeStatusAndTitle(results)

  await knx("test_task_")
    .where({ id })
    .update({
      status,
      result: JSON.stringify({
        title,
        name: filename,
        path: output,
        url: baseUrl + filename,
      }),
      end_at: dayjs().format(),
    })

  broadcast(wss, {
    event: "food-task-status",
    id,
    status,
  })

  broadcast(wss, {
    event: "exec-task-res",
    state: { id, _i: -1 },
  })
}

async function updateMtTags(id, cookie, table, wss) {
  console.log(":food-task-begin", id, table)
  await onProcessing(wss, id)

  const transformRow = row => {
    let { 店铺id, 分类名称, 分类id, 新分类名, 分类描述, 开关置顶, 置顶时段, 分类排序 } = row

    return {
      wmPoiId: transformers.asID(店铺id, "店铺id必填"),
      tagName: transformers.asOptString(分类名称, "分类名称选填"),
      tagId: transformers.asOptID(分类id, "分类id选填"),
      newTagName: transformers.asOptString(新分类名, "新分类名选填"),
      tagDesc: transformers.asOptString(分类描述, "分类描述选填"),
      topFlag: 开关置顶 == "开" ? 1 : 开关置顶 == "关" ? 0 : null,
      topZone: transformers.asOptString(置顶时段, "置顶时段选填"),
      tagSeq: transformers.asOptInt(分类排序, "分类排序选填，数值类型"),
    }
  }

  const tagMapper = async orow => {
    try {
      let row = transformRow(orow)
      let res = await updateTagPlan({
        ...row,
        cookie,
        id: row.wmPoiId,
      })
      return collectResult(wss, { id, _i: orow._i, result: res })
    } catch (err) {
      console.error(err)
      return collectResult(wss, { id, _i: orow._i, error: err.message ?? JSON.stringify(err) })
    }
  }

  let results = await pMap(table, tagMapper, { concurrency: 3 })
  console.log(":food-task-end", id, results)

  let filename = `修改分类_${id}.json`
  let output = `results/${filename}`
  fs.writeFileSync(output, JSON.stringify(results, null, 2))
  await onFinished(wss, id, results, filename, output)
}

async function updateMtFoods(id, cookie, table, wss) {
  console.log(":food-task-begin", id, table)
  await onProcessing(wss, id)

  const transformRow = row => {
    let {
      店铺id,
      分类名称,
      商品名称,
      商品id,
      数量,
      数量单位,
      价格,
      餐盒数量,
      餐盒价格,
      最小购买量,
      折扣价格,
      折扣限购,
      删除折扣,
      图片,
      属性,
      描述,
      上下架商品,
      删除商品,
      新商品名,
    } = row

    return {
      wmPoiId: transformers.asID(店铺id, "店铺id必填"),
      tagName: transformers.asOptString(分类名称, "分类名称选填"),
      spuName: transformers.asOptString(商品名称, "商品名称必填"),
      spuId: transformers.asOptID(商品id, "商品id选填，数值类型"),
      weight: transformers.asOptInt(数量, "数量选填，数值类型"),
      weightUnit: transformers.asOptString(数量单位, "数量单位选填，数值类型"),
      price: transformers.asOptNumber(价格, "价格选填，数值类型"),
      boxNum: transformers.asOptPosInt(餐盒数量, "餐盒数量选填，数值类型"),
      boxPrice: transformers.asOptNumber(餐盒价格, "餐盒价格选填，数值类型"),
      minOrderCount: transformers.asOptPosInt(最小购买量, "最小购买量选填，数值类型"),
      actPrice: transformers.asOptNumber(折扣价格, "折扣价格选填，数值类型"),
      orderLimit: transformers.asOptInt(折扣限购, "折扣限购选填，数值类型"),
      delActFlag: 删除折扣 == 1 ? true : false,
      pic: transformers.asOptString(图片, "图片选填"),
      attr: transformers.asOptString(属性, "属性选填"),
      desc: transformers.asOptString(描述, "描述选填"),
      sellFlag: 上下架商品 == "上架" ? 0 : 上下架商品 == "下架" ? 1 : null,
      delSpuFlag: 删除商品 == 1 ? true : false,
      newSpuName: transformers.asOptString(新商品名, "新商品名选填"),
    }
  }

  const spuMapper = async spu => {
    console.log(":task-exec", id, spu.分类名称, spu.商品名称, spu.商品id)
    try {
      let row = transformRow(spu)
      let res = await updateSpuPlan({
        ...row,
        cookie,
        id: row.wmPoiId,
      })
      return collectResult(wss, { id, _i: spu._i, result: res })
    } catch (err) {
      console.error(err)
      return collectResult(wss, { id, _i: spu._i, error: err.message ?? JSON.stringify(err) })
    }
  }

  const poiMapper = async poi => {
    console.log(":task-exec", id, poi.group)
    if (
      poi.members.some(
        v => v.价格 != null || v.餐盒数量 != null || v.餐盒价格 != null || v.数量 != null || v.数量单位 != null
      )
    ) {
      await tryCreateTestFoods(cookie, poi.group)
    }
    let results = await pMap(poi.members, spuMapper, { concurrency: 4 })
    await tryDeleteTestFoods(cookie, poi.group)
    return results
  }

  let pois = groupBy(table, "店铺id")

  let results = await pMap(pois, poiMapper, { concurrency: 5 })
  results = results.flat()
  console.log(":food-task-end", id, results)

  let filename = `修改商品_${id}.json`
  let output = `results/${filename}`
  fs.writeFileSync(output, JSON.stringify(results, null, 2))
  await onFinished(wss, id, results, filename, output)
}

async function substituteMtFoods(id, cookie, table, wss) {
  console.log(":food-task-begin", id, table)
  await onProcessing(wss, id)

  const transformRow = row => {
    let { 店铺id, 分类名称, 商品名称, 替换后分类名称, 替换后商品名称 } = row

    return {
      wmPoiId: transformers.asID(店铺id, "店铺id必填"),
      aTagName: transformers.asOptString(分类名称, "分类名称选填"),
      aSpuName: transformers.asOptString(商品名称, "商品名称必填"),
      bTagName: transformers.asOptString(替换后分类名称, "替换后分类名称必填"),
      bSpuName: transformers.asOptString(替换后商品名称, "替换后商品名称必填"),
    }
  }

  const spuMapper = async spu => {
    console.log(":task-exec", id, spu.分类名称, spu.商品名称)
    try {
      let row = transformRow(spu)
      let res = await substituteSpuPlan({
        ...row,
        cookie,
        id: row.wmPoiId,
      })
      return collectResult(wss, { id, _i: spu._i, result: res })
    } catch (err) {
      console.error(err)
      return collectResult(wss, { id, _i: spu._i, error: err.message ?? JSON.stringify(err) })
    }
  }

  const poiMapper = async poi => {
    console.log(":task-exec", id, poi.group)
    await tryCreateTestFoods(cookie, poi.group)
    let results = await pMap(poi.members, spuMapper, { concurrency: 1 })
    await tryDeleteTestFoods(cookie, poi.group)
    return results
  }

  let pois = groupBy(table, "店铺id")

  let results = await pMap(pois, poiMapper, { concurrency: 3 })
  results = results.flat()
  console.log(":food-task-end", id, results)

  let filename = `替换商品_${id}.json`
  let output = `results/${filename}`
  fs.writeFileSync(output, JSON.stringify(results, null, 2))
  await onFinished(wss, id, results, filename, output)
}

async function updateElmTags(id, ksid, table, wss) {
  console.log(":food-task-begin", id, table)
  await onProcessing(wss, id)

  const transformRow = row => {
    let { 店铺id, 分类名称, 新分类名, 分类描述, 开关置顶, 置顶时段, 分类排序 } = row

    return {
      shopId: transformers.asID(店铺id, "店铺id必填"),
      cateName: transformers.asOptString(分类名称, "分类名称必填"),
      newCateName: transformers.asOptString(新分类名, "新分类名选填"),
      cateDesc: transformers.asOptString(分类描述, "分类描述选填"),
      topFlag: 开关置顶 == "开" ? true : 开关置顶 == "关" ? false : null,
      topStick: transformers.asOptString(置顶时段, "置顶时段选填"),
      cateSeq: transformers.asOptInt(分类排序, "分类排序选填，数值类型"),
    }
  }

  const tagMapper = async orow => {
    try {
      let row = transformRow(orow)
      let res = await updateCatePlan({
        ...row,
        ksid,
        id: row.shopId,
      })
      return collectResult(wss, { id, _i: orow._i, result: res })
    } catch (err) {
      console.error(err)
      return collectResult(wss, { id, _i: orow._i, error: err.message ?? JSON.stringify(err) })
    }
  }

  let results = await pMap(table, tagMapper, { concurrency: 3 })
  console.log(":food-task-end", id, results)

  let filename = `修改分类_${id}.json`
  let output = `results/${filename}`
  fs.writeFileSync(output, JSON.stringify(results, null, 2))
  await onFinished(wss, id, results, filename, output)
}

async function updateElmFoods(id, ksid, table, wss) {
  console.log(":food-task-begin", id, table)
  await onProcessing(wss, id)

  const transformRow = row => {
    let {
      店铺id,
      分类名称,
      商品名称,
      价格,
      餐盒价格,
      最小购买量,
      折扣价格,
      折扣限购,
      删除折扣,
      删除商品,
      新商品名,
    } = row

    return {
      shopId: transformers.asID(店铺id, "店铺id必填"),
      cateName: transformers.asOptString(分类名称, "分类名称选填"),
      foodName: transformers.asOptString(商品名称, "商品名称必填"),
      price: transformers.asOptNumber(价格, "价格选填，数值类型"),
      boxPrice: transformers.asOptNumber(餐盒价格, "餐盒价格选填，数值类型"),
      minPurchase: transformers.asOptPosInt(最小购买量, "最小购买量选填，数值类型"),
      actPrice: transformers.asOptNumber(折扣价格, "折扣价格选填，数值类型"),
      effectTimes: transformers.asOptInt(折扣限购, "折扣限购选填，数值类型"),
      delActFlag: 删除折扣 == 1 ? true : false,
      delFoodFlag: 删除商品 == 1 ? true : false,
      newFoodName: transformers.asOptString(新商品名, "新商品名选填"),
    }
  }

  const foodMapper = async orow => {
    try {
      let row = transformRow(orow)
      let res = await updateFoodPlan({
        ...row,
        ksid,
        id: row.shopId,
      })
      return collectResult(wss, { id, _i: orow._i, result: res })
    } catch (err) {
      console.error(err.message ?? err)
      return collectResult(wss, { id, _i: orow._i, error: err.message ?? JSON.stringify(err) })
    }
  }

  let results = await pMap(table, foodMapper, { concurrency: 3 })
  console.log(":food-task-end", id, results)

  let filename = `修改商品_${id}.json`
  let output = `results/${filename}`
  fs.writeFileSync(output, JSON.stringify(results, null, 2))
  await onFinished(wss, id, results, filename, output)
}

const getTasks = async (state, ws) => {
  let rows = await knx("test_task_")
    .whereIn("type", [
      "修改美团外卖分类",
      "修改美团外卖商品",
      "替换美团外卖商品",
      "修改饿了么外卖分类",
      "修改饿了么外卖商品",
    ])
    .select()
    .orderBy("id", "desc")

  let tasks = rows.map(row => ({
    key: row.id,
    id: row.id,
    类型: row.type,
    名称: row.name,
    文件: JSON.parse(row.input).name,
    状态: row.status,
    结果: row.result ? JSON.parse(row.result).title : null,
    执行时间: dayjs(row.executed_at).format("YYYY-MM-DD HH:mm:ss"),
    结束时间: row.end_at ? dayjs(row.end_at).format("YYYY-MM-DD HH:mm:ss") : row.end_at,
  }))

  return { tasks }
}

const execTask = async (id, type, input, table, wss) => {
  try {
    if (type == "修改美团外卖分类") {
      await updateMtTags(id, input.cookie, table, wss)
    } else if (type == "修改美团外卖商品") {
      await updateMtFoods(id, input.cookie, table, wss)
    } else if (type == "替换美团外卖商品") {
      await substituteMtFoods(id, input.cookie, table, wss)
    } else if (type == "修改饿了么外卖分类") {
      let ksid = input.cookie
      let matches = input.cookie.match(/ksid\s*=\s*(\w+)\s*;/)
      if (matches) ksid = matches[1]
      await updateElmTags(id, ksid, table, wss)
    } else if (type == "修改饿了么外卖商品") {
      let ksid = input.cookie
      let matches = input.cookie.match(/ksid\s*=\s*(\w+)\s*;/)
      if (matches) ksid = matches[1]
      await updateElmFoods(id, ksid, table, wss)
    }
  } catch (err) {
    console.error("exec-task", err)
    onException(wss, id)
  }
}

const addTask = async (state, ws, wss) => {
  const transform = () => {
    let { name, type, input, executedAt } = state

    const asType = value => {
      return transformers.asString(value, "类型必填")
    }

    const asInput = value => {
      const msg = "文件必填"
      if (value == null) throw new Error(msg)
      if (typeof value == "object") {
        let cookie = transformers.asString(value.cookie, "cookie必填")
        let name = transformers.asString(value.name, "文件名必填")
        let path = transformers.asString(value.path, "文件路径")
        let jsonPath = path + ".json"
        let url = baseUrl + name
        return { cookie, name, path, jsonPath, url }
      }
      throw new Error(msg)
    }

    const asExecutedAt = value => {
      const msg = "执行时间必填，大于当前时间"
      if (value == null) throw new Error(msg)
      if (typeof value == "string") {
        value = value.trim()
        if (value == ":now") return { delay: 0, at: dayjs().format() }

        let t = dayjs(value)
        let delay = +t - +dayjs()
        if (delay < 0) throw new Error(msg)
        return { delay, at: t.format() }
      }
      throw new Error(msg)
    }

    return {
      name,
      type: asType(type),
      input: asInput(input),
      executedAt: asExecutedAt(executedAt),
    }
  }

  let { name, type, input, executedAt } = transform()

  let table = await readXls(input.path, "Sheet1")
  table = table.filter(v => Object.values(v).join("") != "")
  table = table.map((v, i) => ({ ...v, _i: i }))

  fs.writeFileSync(input.jsonPath, JSON.stringify(table))

  let [id] = await knx("test_task_")
    .insert({
      type,
      name,
      input: JSON.stringify(input),
      executed_at: executedAt.at,
      status: "待执行",
    })
    .returning("id")

  tasks[id] = { id, results: [] }
  tasks[id].timer = setTimeout(() => {
    execTask(id, type, input, table, wss)
  }, executedAt.delay)

  console.log(":food-task-ready", id, executedAt, table)

  broadcast(wss, {
    event: "food-task-status",
    id,
    status: "待执行",
  })

  return { added: true }
}

const cancelTask = async (state, ws, wss) => {
  const transform = () => {
    let { id } = state

    return {
      id: transformers.asID(id, "ID必填"),
    }
  }

  let { id } = transform()

  let row = await knx("test_task_")
    .where({ id })
    .first()

  if (!row) throw new Error("任务不存在")
  if (row.status == "进行中") throw new Error("进行中的活动不能取消")
  if (row.status.match(/全部成功|部分成功|全部失败/)) throw new Error("已结束的活动不能取消")
  if (row.status == "已取消") throw new Error("已取消的活动不能取消")

  await knx("test_task_")
    .where({ id })
    .update({ status: "已取消" })

  clearTimeout(tasks[id].timer)
  tasks[id].timer = null
  console.log(":food-task-cancel", id, tasks[id])

  broadcast(wss, {
    event: "food-task-status",
    id,
    status: "已取消",
  })

  return { cancelled: true }
}

const getTaskInput = async (state, ws) => {
  const transform = () => {
    let { id } = state

    return {
      id: transformers.asID(id, "ID必填"),
    }
  }

  let { id } = transform()
  let row = await knx("test_task_")
    .where({ id })
    .first()

  if (!row) throw new Error("任务不存在")

  let { jsonPath } = JSON.parse(row.input)
  let inputs = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
  return { inputs }
}

const getTaskResult = async (state, ws) => {
  const transform = () => {
    let { id } = state

    return {
      id: transformers.asID(id, "ID必填"),
    }
  }

  const joinResults = (inputs, results) => {
    return inputs.map(v => {
      let res = results.find(k => k._i == v._i)
      let 结果 = res == null ? null : res.error ? "失败" : "成功"
      return { ...v, 结果, result: res }
    })
  }

  let { id } = transform()
  let row = await knx("test_task_")
    .where({ id })
    .first()

  if (!row) throw new Error("任务不存在")

  let { jsonPath } = JSON.parse(row.input)
  let inputs = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

  if (row.status.match(/待执行|已取消/)) return { results: [] }
  if (row.status.match(/全部成功|部分成功|全部失败/)) {
    let { path } = JSON.parse(row.result)
    let results = JSON.parse(fs.readFileSync(path, "utf-8"))
    return { results: joinResults(inputs, results) }
  }
  if (row.status == "进行中") {
    let results = tasks[id]?.results ?? []
    return { results: joinResults(inputs, results) }
  }
}

export const recoverTasks = async wss => {
  const recover = async row => {
    let { id, type, input, executed_at } = row
    input = JSON.parse(input)
    let delay = Math.max(0, +dayjs(executed_at) - +dayjs())
    let table = await readXls(input.path, "Sheet1")
    table = table.map((v, i) => ({ ...v, _i: i }))
    fs.writeFileSync(input.jsonPath, JSON.stringify(table))

    tasks[id] = { id, results: [] }
    tasks[id].timer = setTimeout(() => {
      execTask(id, type, input, table, wss)
    }, delay)

    console.log(":food-task-recover", id, delay, table)

    broadcast(wss, {
      event: "food-task-status",
      id,
      status: "待执行",
    })
  }

  let rows = await knx("test_task_").select()

  for (let row of rows) {
    if (tasks[row.id] != null) continue
    if (row.status == "待执行") recover(row)
  }
}

app.on("add-food-task", async (json, ws, wss) => {
  try {
    let res = await addTask(json.state, ws, wss)
    send(ws, {
      event: "add-food-task-res",
      state: { result: res },
    })
  } catch (err) {
    console.error(err.message)
    send(ws, {
      event: "add-food-task-res",
      state: { error: err.message },
    })
  }
})

app.on("cancel-food-task", async (json, ws, wss) => {
  try {
    let res = await cancelTask(json.state, ws, wss)
    send(ws, {
      event: "cancel-food-task-res",
      state: { result: res },
    })
  } catch (err) {
    console.error(err.message)
    send(ws, {
      event: "cancel-food-task-res",
      state: { error: err.message },
    })
  }
})

app.on("get-food-tasks", async (json, ws) => {
  try {
    let res = await getTasks(json.state, ws)
    send(ws, {
      event: "get-food-tasks-res",
      state: { result: res },
    })
  } catch (err) {
    console.error(err.message)
    send(ws, {
      event: "get-food-tasks-res",
      state: { error: err.message },
    })
  }
})

app.on("get-food-task-inputs", async (json, ws) => {
  try {
    let res = await getTaskInput(json.state, ws)
    send(ws, {
      event: "get-food-task-inputs-res",
      state: { result: res },
    })
  } catch (err) {
    console.error(err.message)
    send(ws, {
      event: "get-food-task-inputs-res",
      state: { error: err.message },
    })
  }
})

app.on("get-food-task-results", async (json, ws) => {
  try {
    let res = await getTaskResult(json.state, ws)
    send(ws, {
      event: "get-food-task-results-res",
      state: { result: res },
    })
  } catch (err) {
    console.error(err.message)
    send(ws, {
      event: "get-food-task-results-res",
      state: { error: err.message },
    })
  }
})
