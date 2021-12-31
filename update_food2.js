import pMap from "p-map"
import { updatePlan3, delFoods, creFoods } from "./test2.js"
import { updatePlan } from "../20/elm/test.js"
import pLimit from "p-limit"
import apprun from "apprun"
import dayjs from "dayjs"

const app = apprun.app

async function wrap(f, meta, ws, ctx) {
  const _i = meta[meta.length - 1]
  try {
    const data = await f(...meta)
    console.log(data)
    ws.send(JSON.stringify({ event: "@update-food", state: { _i, meta, code: 0, data } }))
  } catch (err) {
    console.error(err)
    ws.send(JSON.stringify({ event: "@update-food", state: { _i, meta, code: 1, err: err.message ?? err } }))
    ctx.errors.push({ _i, meta, err: err.message ?? err })
  }
}

async function updateMtFoods(state, ws) {
  let { auth, jsonTable } = state
  let ctx = { errors: [] }

  jsonTable = jsonTable.filter(v => v.店铺id != "")

  let uniqFoods = Array.from(new Set(jsonTable.map(v => `${v.店铺id}#${v.分类名称}#${v.商品名称}`)))
  let foods = uniqFoods.map(f => {
    let rawFoods = jsonTable.filter(v => `${v.店铺id}#${v.分类名称}#${v.商品名称}` == f)

    let priceBoxPriceWieightAndUnits = rawFoods.map(v => ({
      spec: v.规格名称 == "" ? null : v.规格名称,
      price: v.价格 == "" ? null : v.价格,
      boxPrice: v.餐盒价格 == "" ? null : v.餐盒价格,
      weight: v.数量 == "" ? null : v.数量,
      unit: v.数量单位 == "" ? null : v.数量单位,
    }))

    let actPriceLimits = rawFoods.map(v => ({
      spec: v.规格名称 == "" ? null : v.规格名称,
      actPrice: v.折扣价格 == "" ? null : v.折扣价格,
      orderLimit: v.折扣限购 == "" ? null : v.折扣限购,
    }))

    return {
      ...rawFoods[0],
      priceBoxPriceWieightAndUnits: priceBoxPriceWieightAndUnits.some(
        v => v.price != null || v.boxPrice != null || v.weight != null || v.unit != null
      )
        ? priceBoxPriceWieightAndUnits
        : [],
      actPriceLimits: actPriceLimits.some(v => v.actPrice != null || v.orderLimit != null) ? actPriceLimits : [],
    }
  })

  let data = foods.map((v, i) => [
    auth,
    v.店铺id,
    v.分类名称,
    v.商品名称,
    v.商品id,
    v.最小购买量 == "" ? null : v.最小购买量,
    v.priceBoxPriceWieightAndUnits,
    v.折扣价格 == "" || v.折扣价格 == 0 ? null : v.折扣价格,
    v.折扣限购 == "" ? null : v.折扣限购,
    v.删除折扣 == "1" ? true : false,
    v.图片 == "" ? null : v.图片,
    v.新商品名 == "" ? null : v.新商品名,
    v.属性 == "" ? null : v.属性,
    v.描述 == "" ? null : v.描述,
    v.数量 == "" ? null : v.数量,
    v.数量单位 == "" ? null : v.数量单位,
    v.删除商品 == "1" ? true : false,
    v.下架商品 == "1" ? true : false,
    v.上架商品 == "1" ? true : false,
    v.新分类名 == "" ? null : v.新分类名,
    v.分类描述 == "" ? null : v.分类描述,
    v.开启置顶 == "1" ? true : v.开启置顶,
    v.关闭置顶 == "1" ? true : v.关闭置顶,
    v.置顶时段 == "" ? null : v.置顶时段,
    v.分类排序 == "" ? null : v.分类排序,
    i,
    v._i,
  ])

  let uniqShops = Array.from(new Set(data.map(v => v[1])))
  let shops = uniqShops.map(s => data.filter(v => v[1] == s))

  let cellConcurrency = shops.length <= 3 ? 12 : 3

  async function handleFood(food) {
    let res = await wrap(updatePlan3, food, ws, ctx)
    return res
  }

  async function handleShop(shop) {
    console.log(shop[0][1])
    if (shop[0][6].length > 0) await creFoods(auth, shop[0][1])
    let res = await pMap(shop, handleFood, { concurrency: cellConcurrency })
    await wrap(delFoods, [auth, shop[0][1]], ws, ctx)
    return res
  }

  await pMap(shops, handleShop, { concurrency: 6 })

  // await Promise.all(
  //   shops.map(shop => limitA(async () => {
  //     console.log(shop[0][1])

  //     await Promise.all(
  //       shop.map(d => limitB(() => wrap(updatePlan3, d, ws, ctx)))
  //     )

  //     await wrap(delFoods, [auth, shop[0][1]], ws, ctx)
  //   }))
  // )

  ws.send(JSON.stringify({ event: "@update-food", state: { _i: -1, errors: ctx.errors } }))
  console.log("end")
}

async function updateElmFoods(state, ws) {
  const { auth, jsonTable } = state
  let ctx = { errors: [] }
  const limit = pLimit(20)

  let ksid = auth
  let ksid_match = auth?.match(/ksid\s*=\s*(\w+)\s*;/)
  if (ksid_match) ksid = ksid_match[1]

  let data = jsonTable.map(v => [
    ksid,
    v.店铺id,
    v.商品名称,
    v.分类名称,
    v.最小购买量 == "" ? null : v.最小购买量,
    v.餐盒价格 == "" ? null : v.餐盒价格,
    v.价格 == "" ? null : v.价格,
    v.折扣价格 == "" || v.折扣价格 == 0 ? null : v.折扣价格,
    v.折扣限购 == "" ? null : v.折扣限购,
    v.删除折扣 == "1" ? true : false,
    v.删除商品 == "1" ? true : false,
    v.新分类名 == "" ? null : v.新分类名,
    v.分类描述 == "" ? null : v.分类描述,
    v.开启置顶 == "1" ? true : false,
    v.关闭置顶 == "1" ? true : false,
    v.置顶时段 == "" ? null : v.置顶时段,
    v.分类排序 == "" ? null : v.分类排序,
    v.新商品名 == "" ? null : v.新商品名,
    v._i,
  ])

  await Promise.all(data.map(d => limit(() => wrap(updatePlan, d, ws, ctx))))
}

app.on("@update-food", async (data, ws) => {
  console.log("<-", data)
  const {
    state: { platform, at },
  } = data

  if (at) {
    let delay = at - +dayjs()
    if (delay < 0) delay = at + 24 * 60 * 60 * 1000 - +dayjs()
    console.log("at", delay, dayjs(at).format("YYYY-MM-DD HH:mm:ss"))
    setTimeout(async () => {
      if (platform == 1) {
        await updateMtFoods(data.state, ws)
      } else {
        await updateElmFoods(data.state, ws)
      }
    }, delay)
  } else {
    if (platform == 1) {
      await updateMtFoods(data.state, ws)
    } else {
      await updateElmFoods(data.state, ws)
    }
  }
})
