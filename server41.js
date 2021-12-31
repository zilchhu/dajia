import Koa from "koa"
import Router from "koa-router"
import bodyParser from "koa-bodyparser"
import cors from "koa2-cors"
import multer from "@koa/multer"
import serve from "koa-static"
import flatten from "flatten"
import fs from "fs"
import path from "path"
import axios from "axios"
import md5 from "md5"
import uuid from "uuid"
import qs from "qs"
import pLimit from "p-limit"
import CryptoJS from "crypto-js"
import { parseAsync } from "json2csv"

// import { getAllElmShops } from './tools/all.js'
import { readXls, readJson } from "./fallback/fallback_app.js"
import { getAllElmShops } from "./tools/all.js"

import dayjs from "dayjs"

import { mt_shops } from "../21/mt_poi.js"

// import localeData from 'dayjs/plugin/localeData'
// import weekday from 'dayjs/plugin/weekday'
// import updateLocale from 'dayjs/plugin/updateLocale'

// import 'dayjs/locale/zh-cn'

// dayjs.extend(localeData)
// dayjs.extend(weekday)
// dayjs.extend(updateLocale)

// dayjs.locale('zh-cn')

// dayjs.updateLocale('zh-cn', {
//   weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
// })

Array.prototype.groupBy = function(key) {
  let values = Array.from(new Set(this.map(v => v[key])))
  return values.map(v => ({
    group: v,
    members: this.filter(k => k[key] == v),
  }))
}

function omit(obj, ks) {
  let newKs = Object.keys(obj).filter(v => !ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

import knx from "../50/index.js"

async function t() {
  try {
    // const r = await knx('foxx_operating_data')
    //   .select()
    //   .where({ date: 20210306 })
    // const d = Array.from(new Set(r.map(v => v.shop_name))).map(v => r.find(k => k.shop_name == v))
    // await knx('foxx_operating_data')
    //   .where({ date: 20210306 })
    //   .del()
    // // console.log(d)
    // console.log(await knx('foxx_operating_data').insert(d))
    // const r = await knx('foxx_operating_data').select()
    // let cnt = r.length
    // for (let r0 of r) {
    //   console.log(cnt)
    //   try {
    //     await knx('test_analyse_t_')
    //       .where({ shop_name: r0.shop_name, date: r0.date, platform: r0.platform })
    //       .update({ unit_price: r0.unit_price })
    //   } catch (e) {
    //     console.error(e)
    //   }
    //   cnt -= 1
    // }
    // let data = await knx('foxx_real_shop_info').select()
    // let i = 0
    // for (let row of data) {
    //   let res = await knx('test_analyse_t_')
    //     .where({ shop_id: row.shop_id, platform: row.platform == 1 ? '美团' : '饿了么' })
    //     .update({ real_shop: row.real_shop_name })
    //   console.log(res, i)
    //   i += 1
    // }

    let c = await readXls("plan/test_analyse_t_.xlsx", "test_analyse_t_")
    console.log(c.length)
    for (let row of c) {
      // console.log(row.date)
      console.log(
        await knx("test_analyse_t_")
          .where({ shop_id: row.shop_id, date: row.date })
          .update({ a: row.a })
      )
    }

    // let c = await readXls('plan/门店各项成本-5月统计表.xlsx', 'Sheet1')
    // for (let row of c) {
    //   const { 人均工资, 人数, 员工住宿, 水电, 铺租 } = row

    //   let update = {}
    //   if (水电 && 水电 != '') update = { ...update, water_electr: 水电 }
    //   if (员工住宿 && 员工住宿 != '') update = { ...update, staff_accom: 员工住宿 }
    //   if (人数 && 人数 != '') update = { ...update, staff_cnt: 人数 }
    //   if (人均工资 && 人均工资 != '') update = { ...update, employee_wage: 人均工资 }
    //   if (铺租 && 铺租 != '') update = { ...update, rent: 铺租 }

    //   if (Object.keys(update).length > 0)
    //     console.log(
    //       await knx('foxx_real_shop_info')
    //         .where({ real_shop_name: row.城市物理店 })
    //         .update(update)
    //     )
    //   console.log(row)
    // }

    // let c = await readXls('plan/c4.xlsx', 'c4')
    // let uniq_real_shop_names = Array.from(new Set(c.map(v => v.real_shop_name)))
    // let real_shop_groups = uniq_real_shop_names
    //   .map(name => ({ real_shop_name: name, members: c.filter(v => v.real_shop_name == name) }))
    //   .map(g => ({
    //     ...g, member_count: g.members.length,
    //     has_gc: g.members.find(v => v.shop_name.includes('贡茶')),
    //     has_tp: g.members.find(v => v.shop_name.includes('甜品'))
    //   }))
    // console.log(real_shop_groups)
  } catch (e) {
    console.error(e)
  }
}

// t()

class M {
  constructor(val) {
    this.val = val
  }

  bind(f) {
    return f(this.val)
  }
}

const koa = new Koa()
const router = new Router()
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads")
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname + "-" + Date.now() + path.extname(file.originalname))
    },
  }),
})

koa.use(cors())

koa.use(
  bodyParser({
    onerror: function(err, ctx) {
      ctx.throw("body parse error", 422)
    },
  })
)

koa.use(serve("./uploads/"))

router.post("/upload", async (ctx, next) => {
  let err = await upload
    .single("file")(ctx, next)
    .then(res => res)
    .catch(err => err)
  if (err) {
    console.log(err)
    ctx.body = {
      code: 0,
      e: err.message,
    }
  } else {
    fs.appendFileSync("upload.txt", `${ctx?.request?.ip} ${ctx?.file?.filename} \n`)
    ctx.body = {
      code: 1,
      res: ctx.file,
    }
  }
})

router.get("/ip", ctx => {
  console.log(ctx.request.ip)
  ctx.body = ctx.request.ip
})

router.get("/plugin", ctx => {
  let app = fs.readFileSync("./uploads/app(1).js", "utf-8")
  let plugin = fs.readFileSync("./uploads/plugin2.js", "utf-8")
  ctx.body = app + plugin
})

router.get("/date/:date", async ctx => {})

// multiple dates
router.get("/sum/:date", async ctx => {
  try {
    let { date } = ctx.params
    let { raw } = ctx.query

    if (!date) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await sum(date, raw)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/sum2", async ctx => {
  try {
    const res = await sum2()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/fresh", async ctx => {
  try {
    const res = await fresh()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/perf/:date", async ctx => {
  try {
    let { date } = ctx.params
    let { djh } = ctx.query

    if (!date) {
      ctx.body = { e: "invalid params" }
      return
    }

    const res = await perf(date, djh)
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.get("/perf2", async ctx => {
  try {
    const res = await commision()
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.get("/export/perf", async ctx => {
  try {
    const [res, _] = await knx.raw(perf_sql(100))
    ctx.body = res.map(v => ({ ...v, date: `${v.date}` })).reverse()
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/export/op", async ctx => {
  try {
    const [res, _] = await knx.raw(op_sql(60))
    ctx.body = res.map(v => ({ ...v, shop_id: `${v.shop_id}`, date: `${v.date}` }))
  } catch (e) {
    console.log(e)
    ctx.body = e
  }
})

router.get("/export/op2", async ctx => {
  try {
    let [res, _] = await knx.raw(sum_sql2)
    res = res[2]
    ctx.body = res.map(v => ({ ...v, ym: `${v.ym}` }))
  } catch (e) {
    console.log(e)
    ctx.body = e
  }
})

router.get("/export/op3", async ctx => {
  try {
    let [res, _] = await knx.raw(sum_sql(60))
    res = res[2]
    ctx.body = res.map(v => ({
      ...v,
      date: `${v.date}`,
    }))
  } catch (e) {
    console.log(e)
    ctx.body = e
  }
})

router.get("/export/fresh.csv", async ctx => {
  try {
    const [res, _] = await knx.raw(export_fresh_sql_csv)

    ctx.set("Content-Type", "application/excel")
    ctx.body = await parseAsync(res)
  } catch (e) {
    console.log(e)
    ctx.body = e
  }
})

router.get("/export/fresh", async ctx => {
  try {
    const [res, _] = await knx.raw(export_fresh_sql)
    ctx.body = res.map(v => ({
      ...v,
      evaluate: parseFloat_null(v.evaluate),
      order: parseFloat_null(v.order),
      bizScore: parseFloat_null(v.bizScore),
      moment: parseFloat_null(v.moment),
      turnover: parseFloat_null(v.turnover),
      unitPrice: parseFloat_null(v.unitPrice),
      overview: parseFloat_null(v.overview),
      Entryrate: parseFloat_null(v.Entryrate),
      Orderrate: parseFloat_null(v.Orderrate),
      kangaroo_name: v.kangaroo_name || "",
      a2: v.a2 || "",
    }))
  } catch (e) {
    console.log(e)
    ctx.body = e
  }
})

// all days
router.get("/shop/:shopid", async ctx => {
  try {
    let { shopid } = ctx.params

    if (!shopid) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await shop(shopid)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shop_history/:shopid", async ctx => {
  try {
    let { shopid } = ctx.params
    let { oneday } = ctx.query
    if (!shopid) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await shop_history(shopid, oneday)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})
// 1 day
router.get("/user/:username/:date", async ctx => {
  try {
    let { username, date } = ctx.params
    if (username == "" || !date) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await user(username, date)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/user_acts/:username/:date", async ctx => {
  try {
    let { username, date } = ctx.params
    if (username == "" || !date) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await user_acts(username, date)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/record/indices/:d0/:d1", async ctx => {
  try {
    let { d0, d1 } = ctx.params
    if (d0 == null || d1 == null) {
      ctx.body = { e: "invalid params" }
      return
    }
    let [data, _] = await knx.raw(工单优化指标(d0, d1))
    data = data[2]
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: i,
        优化率: percent(v.优化率),
        解决率: percent(v.解决率),
      })),
    }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post("/plans", async ctx => {
  try {
    let { ids, a } = ctx.request.body
    if (!ids || !a) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await plans(ids, a)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/comments", async ctx => {
  try {
    let { id, c } = ctx.request.body
    if (!id || !c) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await comments(id, c)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shops/mt", async ctx => {
  try {
    const res = await mt_shops()
    // const res2 = await new PoiD().list()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shops/elm", async ctx => {
  try {
    const res = await getAllElmShops()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shops/auths", async ctx => {
  try {
    const mt_auths = await knx("foxx_shop_reptile")
      .select()
      .where({ status: 0 })
    const mt_third_auths = await knx("t_takeaway_shop_reptile").select()
    const elm_auths = await knx("ele_info_manage")
      .select()
      .where({ status: 0 })
    ctx.body = {
      res: mt_auths
        .slice(0, 1)
        .concat(mt_third_auths)
        .map(v => ({ platform: 1, shopId: v.wmpoiid, shopName: v.reptile_type, auth: v.cookie }))
        .concat(
          elm_auths.slice(0, 1).map(v => ({ platform: 2, shopId: v.shop_id, shopName: v.shop_name, auth: v.ks_id }))
        ),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shops/real", async ctx => {
  try {
    const res = await knx("foxx_real_shop_info").select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shops/real2", async ctx => {
  try {
    const [res, _] = await knx.raw("select * from test_shop_ group by real_shop_name")
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shops/all", async ctx => {
  try {
    const [res, _] = await knx.raw("select * from test_shop_")
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/fengniao", async ctx => {
  try {
    const res = await knx("ele_fengniao_info").select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/dada", async ctx => {
  try {
    const res = await knx("dd_login_info").select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shunfeng", async ctx => {
  try {
    const res = await knx("sf_express_user_info").select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/myt", async ctx => {
  try {
    const res = await knx("myt_login_info").select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/addNewShop", async ctx => {
  try {
    let {
      platform,
      shopId,
      shopName,
      roomId,
      realName,
      city,
      person,
      newPerson,
      bd,
      phone,
      isD,
      isM,
      rent,
      project_id,
    } = ctx.request.body
    if (!platform || !shopId || !shopName || !roomId || !realName) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await addNewShop(
      platform,
      shopId,
      shopName,
      roomId,
      realName,
      city,
      person,
      newPerson,
      bd,
      phone,
      isD,
      isM,
      rent,
      project_id
    )
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/addFengniao", async ctx => {
  try {
    let { shopId, shopName, loginName, password } = ctx.request.body
    if (!shopId || !loginName || !password) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await addFengniao(shopId, shopName, loginName, password)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/addDada", async ctx => {
  try {
    let { shopId, shopName, username, password } = ctx.request.body
    if (!shopId || !username || !password) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await addDada(shopId, shopName, username, password)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/addShunfeng", async ctx => {
  try {
    let { shopId, shopName, username, password } = ctx.request.body
    if (!shopId || !username || !password) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await addShunfeng(shopId, shopName, username, password)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/addMyt", async ctx => {
  try {
    let { shopId, loginName, password } = ctx.request.body
    if (!shopId || !loginName || !password) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await addMyt(shopId, loginName, password)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/delFengniao", async ctx => {
  try {
    let { shopId, loginName } = ctx.request.body
    if (!shopId || !loginName) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await delFengniao(shopId, loginName)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/delDada", async ctx => {
  try {
    let { shopId, username } = ctx.request.body
    if (!shopId || !username) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await delDada(shopId, username)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/delShunfeng", async ctx => {
  try {
    let { shopId, username } = ctx.request.body
    if (!shopId || !username) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await delShunfeng(shopId, username)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/delMyt", async ctx => {
  try {
    let { shopId, loginName } = ctx.request.body
    if (!shopId || !loginName) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await delMyt(shopId, loginName)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/cost/:shopId/:date", async ctx => {
  try {
    let { shopId, date } = ctx.params
    if (!shopId) {
      ctx.body = { e: "invalid params" }
      return
    }
    let [data, _] = await knx.raw(维度订单(shopId, date))
    data = data[2]

    data = data.map((v, i) => ({
      key: i,
      ...v,
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/indices/mt/:shopId/:day", async ctx => {
  try {
    let { shopId, day } = ctx.params
    if (!shopId) {
      ctx.body = { e: "invalid params" }
      return
    }
    let data = await indices("美团", shopId, day)

    ctx.set("Cache-Control", "max-age=28800")
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/indices/elm/:shopId/:day", async ctx => {
  try {
    let { shopId, day } = ctx.params
    if (!shopId) {
      ctx.body = { e: "invalid params" }
      return
    }
    let data = await indices("饿了么", shopId, day)

    ctx.set("Cache-Control", "max-age=28800")
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/offsell/mt/:shopId/:day", async ctx => {
  try {
    let { shopId, day } = ctx.params
    if (!shopId) {
      ctx.body = { e: "invalid params" }
      return
    }
    let [data, _] = await knx.raw(
      `SELECT *, tagName AS category_name, boxPrice AS package_fee FROM foxx_food_manage WHERE date = ${day} AND wmpoiid = ${shopId} AND sellStatus = 1`
    )
    ctx.set("Cache-Control", "max-age=28800")
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/offsell/elm/:shopId/:day", async ctx => {
  try {
    let { shopId, day } = ctx.params
    if (!shopId) {
      ctx.body = { e: "invalid params" }
      return
    }
    let [data, _] = await knx.raw(
      `SELECT * FROM ele_food_manage m 
      RIGHT JOIN (
        SELECT id FROM ele_food_manage WHERE bach_date = DATE_FORMAT(DATE_ADD(${day}, INTERVAL 1 DAY), '%Y%m%d') AND shop_id = ${shopId} AND on_shelf = '下架' 
      ) t ON m.id = t.id`
    )
    ctx.set("Cache-Control", "max-age=28800")
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/order/:shopId/:date", async ctx => {
  try {
    let { shopId, date } = ctx.params
    let { activi, counts } = ctx.query
    if (!shopId) {
      ctx.body = { e: "invalid params" }
      return
    }
    let [data, _] = await knx.raw(维度订单详情(shopId, activi, counts, date))
    data = data[2]
    data = data.map((v, i) => ({
      ...v,
      订单信息: v.订单信息?.replace(/(\*\d+)[\|,]/gm, "$1\n")?.replace(/^,/, ""),
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/whitelist/mt/ad/smarts", async ctx => {
  try {
    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "mt_smart_ad_whitelist" })
    let shops = await mt_shops()
    data = Array.from(new Set(data.p_values.split(","))).map(v => ({
      shopId: v,
      shopName: shops.find(s => s.id == v)?.poiName,
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/whitelist/mt/ad/smarts", async ctx => {
  try {
    let { shopId } = ctx.request.body
    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "mt_smart_ad_whitelist" })
    data = Array.from(new Set(data.p_values.split(",")))
    if (data.includes(shopId)) {
      ctx.body = { e: "has been added" }
      return
    }
    let res = await knx("foxx_platform_sys")
      .where({ p_key: "mt_smart_ad_whitelist" })
      .update({ p_values: [...data, shopId].join(",") })
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.delete("/whitelist/mt/ad/smarts", async ctx => {
  try {
    let { shopId } = ctx.request.query

    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "mt_smart_ad_whitelist" })
    data = Array.from(new Set(data.p_values.split(",")))
    if (!data.includes(shopId)) {
      ctx.body = { e: "not found" }
      return
    }
    data.splice(
      data.findIndex(v => v == shopId),
      1
    )
    let res = await knx("foxx_platform_sys")
      .where({ p_key: "mt_smart_ad_whitelist" })
      .update({ p_values: data.join(",") })
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/whitelist/mt/ad/cpcs", async ctx => {
  try {
    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "mt_ad_cpc_whitelist" })
    let shops = await mt_shops()
    data = Array.from(new Set(data.p_values.split(","))).map(v => ({
      shopId: v,
      shopName: shops.find(s => s.id == v)?.poiName,
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/whitelist/mt/ad/cpcs", async ctx => {
  try {
    let { shopId } = ctx.request.body
    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "mt_ad_cpc_whitelist" })
    data = Array.from(new Set(data.p_values.split(",")))
    if (data.includes(shopId)) {
      ctx.body = { e: "has been added" }
      return
    }
    let res = await knx("foxx_platform_sys")
      .where({ p_key: "mt_ad_cpc_whitelist" })
      .update({ p_values: [...data, shopId].join(",") })
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.delete("/whitelist/mt/ad/cpcs", async ctx => {
  try {
    let { shopId } = ctx.request.query

    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "mt_ad_cpc_whitelist" })
    data = Array.from(new Set(data.p_values.split(",")))
    if (!data.includes(shopId)) {
      ctx.body = { e: "not found" }
      return
    }
    data.splice(
      data.findIndex(v => v == shopId),
      1
    )
    let res = await knx("foxx_platform_sys")
      .where({ p_key: "mt_ad_cpc_whitelist" })
      .update({ p_values: data.join(",") })
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/whitelist/elm/ad/smarts", async ctx => {
  try {
    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "ele_smart_ad_whitelist" })
    let shops = await getAllElmShops()
    data = Array.from(new Set(data.p_values.split(","))).map(v => ({
      shopId: v,
      shopName: shops.find(s => s.id == v)?.name,
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/whitelist/elm/ad/smarts", async ctx => {
  try {
    let { shopId } = ctx.request.body
    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "ele_smart_ad_whitelist" })
    data = Array.from(new Set(data.p_values.split(",")))
    if (data.includes(shopId)) {
      ctx.body = { e: "has been added" }
      return
    }
    let res = await knx("foxx_platform_sys")
      .where({ p_key: "ele_smart_ad_whitelist" })
      .update({ p_values: [...data, shopId].join(",") })
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.delete("/whitelist/elm/ad/smarts", async ctx => {
  try {
    let { shopId } = ctx.request.query

    let data = await knx("foxx_platform_sys")
      .first()
      .where({ p_key: "ele_smart_ad_whitelist" })
    data = Array.from(new Set(data.p_values.split(",")))
    if (!data.includes(shopId)) {
      ctx.body = { e: "not found" }
      return
    }
    data.splice(
      data.findIndex(v => v == shopId),
      1
    )
    let res = await knx("foxx_platform_sys")
      .where({ p_key: "ele_smart_ad_whitelist" })
      .update({ p_values: data.join(",") })
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/a", async ctx => {
  try {
    let [data, _] = await knx.raw(原价扣点城市折扣与原价差距大于2)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "a" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.门店id}:${v.品名}`,
        handle: handles.find(h => h.key == `${v.门店id}:${v.品名}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/b", async ctx => {
  try {
    let [data, _] = await knx.raw(商品无餐盒费)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "b" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.分类}:${v.品名}`,
        原价: fixed2(v.原价),
        handle: handles.find(h => h.key == `${v.shop_id}:${v.分类}:${v.品名}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/c", async ctx => {
  try {
    let [data, _] = await knx.raw(美团薯饼虾饼鸡柳设置两份起购)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/d", async ctx => {
  try {
    let [data, _] = await knx.raw(餐盒费为0常规餐品设置餐盒费1)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/e", async ctx => {
  try {
    let [data, _] = await knx.raw(_0_01两份起购餐盒费调整为1_5)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/f", async ctx => {
  try {
    let [data, _] = await knx.raw(折扣餐品原价_餐盒费会起送)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/g", async ctx => {
  try {
    let [data, _] = await knx.raw(原价扣点城市产品原价与折扣价差距超过1_1)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/h", async ctx => {
  try {
    let [data, _] = await knx.raw(_0元购有餐盒费)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/i", async ctx => {
  try {
    let [data, _] = await knx.raw(加料门店)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/j", async ctx => {
  try {
    let [data, _] = await knx.raw(零元商品有餐盒费)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "j" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.分类}:${v.品名}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${v.分类}:${v.品名}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/k", async ctx => {
  try {
    let [data, _] = await knx.raw(两份起购餐品价格错误)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "k" })
    ctx.body = {
      res: data[2].map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.category_name}:${v.name}`,
        商品原价: fixed2(v.商品原价),
        "凑满减/起送价格": fixed2(v["凑满减/起送价格"]),
        handle: handles.find(h => h.key == `${v.shop_id}:${v.category_name}:${v.name}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/l", async ctx => {
  try {
    let [data, _] = await knx.raw(津贴联盟)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "l" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${dayjs().format("YYYYMMDD")}`,
        实收: fixed2(v.实收),
        handle: handles.find(h => h.key == `${v.shop_id}:${dayjs().format("YYYYMMDD")}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/m", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么所有门店配送费批量检查)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/n", async ctx => {
  try {
    let [data, _] = await knx.raw(原价扣点城市折扣与原价差距大1)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/o", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么无餐盒费_1)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/p", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么两份起购无餐盒费_0_5)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/q", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么_0_01两份起购餐盒费调整为1_5)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/r", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么贡茶粉面套餐价格错误)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/s", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么甜品粉面套餐价格错误)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/t", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么折扣餐品原价_餐盒费会起送)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/u", async ctx => {
  try {
    let [data, _] = await knx.raw(零元购有餐盒费)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/v", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么两份起购餐品价格错误)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/w", async ctx => {
  try {
    let [data, _] = await knx.raw(单折扣起送)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "w" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.category_name}:${v.name}`,
        originalPrice: fixed2(v.originalPrice),
        handle: handles.find(h => h.key == `${v.shop_id}:${v.category_name}:${v.name}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/x", async ctx => {
  try {
    let [data, _] = await knx.raw(成本表查漏)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "x" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.商品名称}`,
        handle: handles.find(h => h.key == `${v.商品名称}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/y", async ctx => {
  try {
    let [data, _] = await knx.raw(查询点金0曝光的时间)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "y" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${dayjs().format("YYYYMMDD")}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${dayjs().format("YYYYMMDD")}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/z", async ctx => {
  try {
    let [data, _] = await knx.raw(美团配送范围对比昨日)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/aa", async ctx => {
  try {
    let [data, _] = await knx.raw(检查折扣遗漏的商品)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "aa" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.category_name}:${v.name}`,
        price: fixed2(v.price),
        handle: handles.find(h => h.key == `${v.shop_id}:${v.category_name}:${v.name}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ab", async ctx => {
  try {
    let [data, _] = await knx.raw(折扣到期商品检查)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ab" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.food_name}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${v.food_name}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ac", async ctx => {
  try {
    let [data, _] = await knx.raw(减配活动检查)
    data = data[1]
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ac" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.门店编号}:${v.到期时间}`,
        handle: handles.find(h => h.key == `${v.门店编号}:${v.到期时间}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ad", async ctx => {
  try {
    let [data, _] = await knx.raw(假减配检查)
    ctx.body = { res: data.map((v, i) => ({ ...v, key: i })) }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ae", async ctx => {
  try {
    let [data, _] = await knx.raw(满减活动检查)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ae" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.店铺编号}:${v.活动类型}:${v.活动规则}`,
        活动规则: v.活动规则 ? v.活动规则.split(/(?=满)/).join("\n") : v.活动规则,
        handle: handles.find(h => h.key == `${v.店铺编号}:${v.活动类型}:${v.活动规则}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/af", async ctx => {
  try {
    let [data, _] = await knx.raw(库存过少检查)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "af" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.店铺id}:${v.分类}:${v.商品}`,
        handle: handles.find(h => h.key == `${v.店铺id}:${v.分类}:${v.商品}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ag", async ctx => {
  try {
    let [data, _] = await knx.raw(查询商品多规格)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ag" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.店铺id}:${v.分类名}:${v.商品名}`,
        handle: handles.find(h => h.key == `${v.店铺id}:${v.分类名}:${v.商品名}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

var cacheBadRates = { time: 1, data: [] }

router.get("/probs/ai", async ctx => {
  try {
    let [shops, _] = await knx.raw(`SELECT shop_id, real_shop_name, person FROM test_shop_`)

    let elm_shops = await knx("ele_info_manage").where({ status: 0 })

    let badRates1 = await axios.get(
      `http://localhost:3000/elm/rates/bad?startTime=${dayjs()
        .subtract(48, "hour")
        .format("YYYY-MM-DDTHH:mm:ss")}&endTime=${dayjs().format("YYYY-MM-DDT23:59:59")}&shopid=93089700&ksid=${
        elm_shops[0].ks_id
      }&rateType=BAD_REVIEW`
    )

    // let badRates2 = await axios.get(
    //   `http://localhost:3000/elm/rates/bad?startTime=${dayjs()
    //     .subtract(48, 'hour')
    //     .format('YYYY-MM-DDTHH:mm:ss')}&endTime=${dayjs().format(
    //       'YYYY-MM-DDT23:59:59'
    //     )}&shopid=97850773&ksid=MWM2MWMTA1MjcyMDc0NjUxMDAxTmUyK0hFczJQ&rateType=BAD_REVIEW`
    // )

    let badRates3 = await axios.get(
      `http://localhost:3000/elm/rates/bad?startTime=${dayjs()
        .subtract(48, "hour")
        .format("YYYY-MM-DDTHH:mm:ss")}&endTime=${dayjs().format("YYYY-MM-DDT23:59:59")}&shopid=93089700&ksid=${
        elm_shops[0].ks_id
      }&rateType=MEDIUM_REVIEW`
    )

    // let badRates4 = await axios.get(
    //   `http://localhost:3000/elm/rates/bad?startTime=${dayjs()
    //     .subtract(48, 'hour')
    //     .format('YYYY-MM-DDTHH:mm:ss')}&endTime=${dayjs().format(
    //       'YYYY-MM-DDT23:59:59'
    //     )}&shopid=97850773&ksid=MWM2MWMTA1MjcyMDc0NjUxMDAxTmUyK0hFczJQ&rateType=MEDIUM_REVIEW`
    // )
    // console.log(badRates1, badRates2)

    // if (!badRates1.data?.map || !badRates2.data?.map) {
    //   ctx.body = { e: badRates1.data }
    //   return
    // }

    let badRates = {
      data: arr(badRates1.data)
        .map(r => ({ ...r, ksid: elm_shops[0].ks_id }))
        // .concat(badRates2.data.map(r => ({ ...r, ksid: 'MWM2MWMTA1MjcyMDc0NjUxMDAxTmUyK0hFczJQ' })))
        .concat(arr(badRates3.data).map(r => ({ ...r, ksid: elm_shops[0].ks_id }))),
      // .concat(badRates4.data.map(r => ({ ...r, ksid: 'MWM2MWMTA1MjcyMDc0NjUxMDAxTmUyK0hFczJQ' })))
    }

    let data = await Promise.allSettled(
      badRates.data.map(async rate => {
        let orderId = await axios.get(
          `http://localhost:3000/elm/order/${rate.shopId}/${rate.orderRateInfos[0].rateId}?ksid=${rate.ksid}`
        )
        return {
          ...rate,
          orderId: orderId.data,
          platform: "饿了么",
          person: shops.find(s => s.shop_id == rate.shopId)?.person,
          real_shop_name: shops.find(s => s.shop_id == rate.shopId)?.real_shop_name,
          ratingContents: rate.orderRateInfos.map(i => i.ratingContent).join("\n"),
          ratingAt: rate.orderRateInfos[0].ratingAt,
          serviceRating: rate.orderRateInfos[0].serviceRating,
          rateId: rate.orderRateInfos[0].rateId,
        }
      })
    )

    let data2 = await axios.get(`http://localhost:3000/mt/rates/bad`)

    // console.log('data2', Object.entries(data2))

    data2 =
      data2.data?.map(rate => ({
        ...rate,
        rateId: rate.id,
        shopId: rate.wm_poi_id,
        shopName: rate.poiName,
        platform: "美团",
        person: shops.find(s => s.shop_id == rate.wm_poi_id)?.person,
        real_shop_name: shops.find(s => s.shop_id == rate.wm_poi_id)?.real_shop_name,
        ratingContents: rate.comment,
        ratingAt: rate.createTime,
        imageUrls: rate.picture_urls,
        serviceRating: rate.order_comment_score,
      })) ?? []

    data = data
      .filter(v => v.status == "fulfilled")
      .map(v => v.value)
      .concat(data2)

    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ai" })

    ctx.set("Cache-Control", "max-age=600")

    ctx.body = {
      res: data
        .map((v, i) => ({
          ...v,
          key: `${v.shopId}:${v.rateId}`,
          handle: handles.find(h => h.key == `${v.shopId}:${v.rateId}`)?.handle,
        }))
        .sort((a, b) => a.real_shop_name?.localeCompare(b.real_shop_name)),
    }
  } catch (e) {
    console.error("ai error", e)
    ctx.body = { e }
  }

  function arr(v) {
    if (Array.isArray(v)) return v
    return []
  }
})

router.get("/probs/aj", async ctx => {
  try {
    let [data, _] = await knx.raw(合作方案到期)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "aj" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.店铺id}:${v.到期时间}`,
        handle: handles.find(h => h.key == `${v.店铺id}:${v.到期时间}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ah/:day", async ctx => {
  try {
    let { day } = ctx.request.params
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ah" })
    let [data, _] = await knx.raw(推广费余额(day))
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${dayjs().format("YYYYMMDD")}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${dayjs().format("YYYYMMDD")}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ak", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么低折扣商品起购错误)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ak" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.店铺id}:${v.分类}:${v.商品}`,
        handle: handles.find(h => h.key == `${v.店铺id}:${v.分类}:${v.商品}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/al", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么低折扣商品限购数量错误)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "al" })
    // data = data[1]
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.itemName}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${v.itemName}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/am", async ctx => {
  try {
    let [data, _] = await knx.raw(起送价变化)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "am" })
    // data = data[1]
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.起送价}:${v.前一天起送价}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${v.起送价}:${v.前一天起送价}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/an", async ctx => {
  try {
    let [data, _] = await knx.raw("select * from test_shop_prob_")
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: v.id,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/probs/an/add", async ctx => {
  try {
    let { a, b, c, d, e, f, g } = ctx.request.body
    console.log(ctx.request.body)
    if ([a, b, c, d, e, f].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }
    const res = await knx("test_shop_prob_").insert({
      物理店名: a,
      组员: b,
      组长: c,
      门店人数: parseInt(d),
      老板是否好沟通: e,
      老板的诉求: f,
      门店的问题: g,
    })
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post("/probs/an/edit", async ctx => {
  try {
    let { id, a, b, c, d, e, f, g } = ctx.request.body
    if ([id, a, b, c, d, e, f].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }
    const res = await knx("test_shop_prob_")
      .where({ id })
      .update({
        物理店名: a,
        组员: b,
        组长: c,
        门店人数: d,
        老板是否好沟通: e,
        老板的诉求: f,
        门店的问题: g,
      })
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.get("/probs/_shs", async ctx => {
  try {
    let [data, _] = await knx.raw("select * from shs_shop_relation")
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: i,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

let sss_caches = {
  data: [],
  expired_at: dayjs().unix(),
}

router.get("/probs/_sss", async ctx => {
  try {
    let data = await sss_remote()
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: i,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e: e.message }
  }
})

async function sss() {
  const sql = `SELECT d.shop_id, d.relation_shop, s.shop_name, IF(s.platform = 1, '美团', '饿了么') AS shop_plat
    FROM deliver_account d
    LEFT JOIN test_shop_ s USING(shop_id)
    WHERE d.platform = 'sss'`

  const [data] = await knx.raw(sql)

  return data.map(r => ({
    店铺ID: r.shop_id,
    店铺名称: r.shop_name,
    平台: r.shop_plat,
    闪时送名称: r.relation_shop,
  }))
}

async function sss_remote() {
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzYwODUzMjYsInVzZXJuYW1lIjoiMTM5Mjc0MjkzOTEifQ.ahvs8ahSX2TvopPI7C_l_srB6eNuLhfni7V9Den_-hc"

  async function login() {
    const { data } = await axios({
      method: "POST",
      url: "https://ag.zhuopaikeji.com/system-api/sys/login",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        dnt: 1,
        origin: "https://ag.zhuopaikeji.com",
        referer: "https://ag.zhuopaikeji.com/user/login?redirect=%2FuserManagement%2FshopManagement",
        tenant_id: 0,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
      },
      data: {
        password: "ystp8888",
        remember_me: true,
        username: "13927429391",
      },
    })
    if (data.message != "登录成功") throw new Error(data.message)
    return data.result.token
  }

  async function storeList(token, pageNum = 1, pageSize = 10) {
    const { data } = await axios({
      method: "POST",
      url: "https://ag.zhuopaikeji.com/system-api/customer/store/list",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        dnt: 1,
        origin: "https://ag.zhuopaikeji.com",
        referer: "https://ag.zhuopaikeji.com/userManagement/shopManagement",
        tenant_id: 0,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
        "x-access-token": token,
      },
      data: {
        pageNo: pageNum,
        pageSize,
      },
    })
    if (data.success != true) throw new Error(data.message)
    return data.result
  }

  async function tryLogin() {
    try {
      const token = await login()
      return { result: token }
    } catch (err) {
      console.error(err.message)
      return { error: err.message }
    }
  }

  async function fetchAllStoreList(token) {
    try {
      let limit = pLimit(3)
      let { pages, records } = await storeList(token)
      pages = Array.from(Array(pages).keys()).map(i => i + 1)
      let list = await Promise.all(pages.map(p => limit(() => storeList(token, p))))
      return list.flatMap(it => it.records)
    } catch (err) {
      console.error(err.message)
      let { result, error } = tryLogin()
      if (error) throw new Error(error)
      return await fetchAllStoreList(result)
    }
  }

  let stores = []
  if (dayjs().unix() < sss_caches.expired_at) {
    stores = sss_caches.data
  } else {
    stores = await fetchAllStoreList(token)
    sss_caches = { data: stores, expired_at: dayjs().unix() + 10 * 60 * 1000 }
  }

  const sql = `SELECT d.shop_id, d.relation_shop, s.shop_name, IF(s.platform = 1, '美团', '饿了么') AS shop_plat
    FROM deliver_account d
    LEFT JOIN test_shop_ s USING(shop_id)
    WHERE d.platform = 'sss'`

  const [sss_ds] = await knx.raw(sql)

  return stores.map(store => {
    let shop = sss_ds.find(d => d.relation_shop == store.storeName)
    return {
      闪时送名称: store.storeName,
      店铺ID: shop?.shop_id,
      店铺名称: shop?.shop_name,
      平台: shop?.shop_plat,
    }
  })
}

router.post("/probs/_sss/add", async ctx => {
  try {
    const { shop_id, sss_name } = ctx.request.body
    if ([shop_id, sss_name].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }
    const res = await sss_add(ctx.request.body)
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e: e.message }
  }
})

async function sss_add(form) {
  const { shop_id, sss_name } = form
  const row = await knx("deliver_account")
    .where({ shop_id, platform: "sss" })
    .first()
  if (row) throw new Error("门店已存在")

  return knx("deliver_account").insert({
    shop_id,
    platform: "sss",
    account: "13927429391",
    pw: "ystp8888",
    relation_shop: sss_name,
  })
}

router.post("/probs/_sss/edit", async ctx => {
  try {
    let { shop_id } = ctx.request.body
    if ([shop_id].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }

    const res = await sss_edit(ctx.request.body)
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e: e.message }
  }
})

async function sss_edit(form) {
  const { shop_id, sss_name } = form
  const row = await knx("deliver_account")
    .where({ shop_id, platform: "sss" })
    .first()

  if (row) {
    return knx("deliver_account")
      .where({ id: row.id })
      .update({ relation_shop: sss_name })
  } else {
    return knx("deliver_account").insert({
      shop_id,
      platform: "sss",
      account: "13927429391",
      pw: "ystp8888",
      relation_shop: sss_name,
    })
  }
}

router.get("/probs/_zps", async ctx => {
  try {
    let data = await zps()
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: i,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e: e.message }
  }
})

async function zps() {
  const sql = `WITH d_info AS (-- 配送信息
      SELECT shop_id, shop_product_desc
      FROM ele_delivery_fee
      WHERE DATE_FORMAT( insert_date, "%Y-%m-%d" ) = CURDATE()
        AND shop_product_desc IN ( '蜂鸟快送', '蜂鸟众包', '蜂鸟专送', '自配送', 'e配送', '混合送' )
      UNION ALL
      SELECT shop_id, quickly_send
      FROM foxx_delivery_cost 
      WHERE date > CURDATE()
        AND quickly_send <> '美团全城送'
    ),
    a_info AS (
      SELECT d.shop_id, d.platform, d.account, d.pw, d.sf_id
      FROM deliver_account d
    )
    SELECT s.shop_id, s.shop_name, IF(s.platform = 1, '美团', '饿了么') AS shop_plat, s.city, s.person, s.real_shop_name, 
      d.platform, d.account, d.pw, d.sf_id, di.shop_product_desc AS way 
    FROM test_shop_ s
    LEFT JOIN a_info d USING(shop_id)
    LEFT JOIN d_info di USING(shop_id)
    ORDER BY s.real_shop_name`

  const [data] = await knx.raw(sql)
  // shop_id	shop_name	城市	物理店	person	配送方式	platform	dd账号	dd密码	fn账号	fn密码	sf账号	sf密码	闪时送账号	闪时送密码	外卖邦账号	外卖邦密码	麦芽田账号	麦芽田密码
  const shop_groups = data.groupBy("shop_id")
  return shop_groups
    .map(g => {
      let shop_id = g.group
      let dd = g.members.find(s => s.platform == "dd")
      let fn = g.members.find(s => s.platform == "fn")
      let sf = g.members.find(s => s.platform == "sf")
      let sss = g.members.find(s => s.platform == "sss")
      let wmb = g.members.find(s => s.platform == "wmb")
      let myt = g.members.find(s => s.platform == "myt")
      let ss = g.members.find(s => s.platform == "ss")
      let uu = g.members.find(s => s.platform == "uu")

      return {
        shop_id,
        shop_name: g.members[0].shop_name,
        city: g.members[0].city,
        real_shop_name: g.members[0].real_shop_name,
        person: g.members[0].person,
        shop_plat: g.members[0].shop_plat,
        d_way: g.members[0].way,
        dd_acct: dd?.account,
        dd_pw: dd?.pw,
        fn_acct: fn?.account,
        fn_pw: fn?.pw,
        sf_acct: sf?.account,
        sf_pw: sf?.pw,
        sf_id: sf?.sf_id,
        sss_acct: sss?.account,
        sss_pw: sss?.pw,
        wmb_acct: wmb?.account,
        wmb_pw: wmb?.pw,
        myt_acct: myt?.account,
        myt_pw: myt?.pw,
        ss_acct: ss?.account,
        ss_pw: ss?.pw,
        uu_acct: uu?.account,
        uu_pw: uu?.pw,
      }
    })
    .map(rec => ({
      店铺ID: rec.shop_id,
      店铺名称: rec.shop_name,
      城市: rec.city,
      物理店: rec.real_shop_name,
      负责人: rec.person,
      平台: rec.shop_plat,
      配送方式: rec.d_way,
      达达账号: rec.dd_acct,
      达达密码: rec.dd_pw,
      蜂鸟账号: rec.fn_acct,
      蜂鸟密码: rec.fn_pw,
      顺丰账号: rec.sf_acct,
      顺丰密码: rec.sf_pw,
      顺丰ID: rec.sf_id,
      闪时送账号: rec.sss_acct,
      闪时送密码: rec.sss_pw,
      // 外卖邦账号: rec.wmb_acct,
      // 外卖邦密码: rec.wmb_pw,
      麦芽田账号: rec.myt_acct,
      麦芽田密码: rec.myt_pw,
      闪送账号: rec.ss_acct,
      闪送密码: rec.ss_pw,
      UU账号: rec.uu_acct,
      UU密码: rec.uu_pw,
    }))
}

router.post("/probs/_zps/add", async ctx => {
  try {
    const { shop_id } = ctx.request.body
    if ([shop_id].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }
    const res = await zps_add(ctx.request.body)
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e: e.message }
  }
})

async function zps_add(form) {
  function is_empty(v) {
    return v == null || v == "" || /^\s+$/.test(v)
  }

  async function add_by_plat(rows, shop_id, plat, acct, pw) {
    if (is_empty(acct) || is_empty(pw)) return null

    return knx("deliver_account").insert({
      shop_id,
      platform: plat,
      account: acct,
      pw,
    })
  }

  async function add_sf_info(rows, shop_id, acct, pw, sf_id) {
    if (is_empty(acct) || is_empty(pw)) return null

    return knx("deliver_account").insert({
      shop_id,
      platform: "sf",
      account: acct,
      pw,
      sf_id,
    })
  }

  const {
    shop_id,
    dd_acct,
    dd_pw,
    fn_acct,
    fn_pw,
    sf_acct,
    sf_pw,
    sf_id,
    sss_acct,
    sss_pw,
    wmb_acct,
    wmb_pw,
    myt_acct,
    myt_pw,
    ss_acct,
    ss_pw,
    uu_acct,
    uu_pw,
  } = form

  const rows = await knx("deliver_account")
    .where({ shop_id })
    .select()
  if (rows.length > 0) throw new Error("门店已存在")

  let results = {}

  results.dd = await add_by_plat(rows, shop_id, "dd", dd_acct, dd_pw)
  results.fn = await add_by_plat(rows, shop_id, "fn", fn_acct, fn_pw)
  // results.sf = await add_by_plat(rows, shop_id, 'sf', sf_acct, sf_pw)
  results.sf = await add_sf_info(rows, shop_id, sf_acct, sf_pw, sf_id)
  results.sss = await add_by_plat(rows, shop_id, "sss", sss_acct, sss_pw)
  // results.wmb = await add_by_plat(rows, shop_id, 'wmb', wmb_acct, wmb_pw)
  results.myt = await add_by_plat(rows, shop_id, "myt", myt_acct, myt_pw)
  results.ss = await add_by_plat(rows, shop_id, "ss", ss_acct, ss_pw)
  results.uu = await add_by_plat(rows, shop_id, "uu", uu_acct, uu_pw)

  return results
}

router.post("/probs/_zps/edit", async ctx => {
  try {
    let { shop_id } = ctx.request.body
    if ([shop_id].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }

    const res = await zps_edit(ctx.request.body)
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e: e.message }
  }
})

async function zps_edit(form) {
  function is_empty(v) {
    return v == null || v == "" || /^\s+$/.test(v)
  }

  async function update_by_plat(rows, shop_id, plat, acct, pw) {
    // if (is_empty(acct) || is_empty(pw)) return null

    const row = rows.find(r => r.platform == plat)
    if (row) {
      if (is_empty(acct) || is_empty(pw)) {
        return knx("deliver_account")
          .where({ id: row.id })
          .delete()
      }

      return knx("deliver_account")
        .where({ id: row.id })
        .update({
          account: acct,
          pw,
        })
    } else {
      if (is_empty(acct) || is_empty(pw)) return null

      return knx("deliver_account").insert({
        shop_id,
        platform: plat,
        account: acct,
        pw,
      })
    }
  }

  async function update_sf_info(rows, shop_id, acct, pw, sf_id) {
    // if (is_empty(acct) || is_empty(pw)) return null

    const row = rows.find(r => r.platform == "sf")

    if (row) {
      if (is_empty(acct) || is_empty(pw)) {
        return knx("deliver_account")
          .where({ id: row.id })
          .delete()
      }

      return knx("deliver_account")
        .where({ id: row.id })
        .update({
          account: acct,
          pw,
          sf_id,
        })
    } else {
      if (is_empty(acct) || is_empty(pw)) return null

      return knx("deliver_account").insert({
        shop_id,
        platform: "sf",
        account: acct,
        pw,
        sf_id,
      })
    }
  }

  const {
    shop_id,
    dd_acct,
    dd_pw,
    fn_acct,
    fn_pw,
    sf_acct,
    sf_pw,
    sf_id,
    sss_acct,
    sss_pw,
    wmb_acct,
    wmb_pw,
    myt_acct,
    myt_pw,
    ss_acct,
    ss_pw,
    uu_acct,
    uu_pw,
  } = form

  const rows = await knx("deliver_account")
    .where({ shop_id })
    .select()

  let results = {}

  results.dd = await update_by_plat(rows, shop_id, "dd", dd_acct, dd_pw)
  results.fn = await update_by_plat(rows, shop_id, "fn", fn_acct, fn_pw)
  results.sf = await update_sf_info(rows, shop_id, sf_acct, sf_pw, sf_id)
  results.sss = await update_by_plat(rows, shop_id, "sss", sss_acct, sss_pw)
  // results.wmb = await update_by_plat(rows, shop_id, 'wmb', wmb_acct, wmb_pw)
  results.myt = await update_by_plat(rows, shop_id, "myt", myt_acct, myt_pw)
  results.ss = await update_by_plat(rows, shop_id, "ss", ss_acct, ss_pw)
  results.uu = await update_by_plat(rows, shop_id, "uu", uu_acct, uu_pw)

  return results
}

router.post("/probs/_shs/add", async ctx => {
  try {
    let { a, b, c, d } = ctx.request.body
    console.log(ctx.request.body)
    if ([b, c].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }
    const res = await knx("shs_shop_relation").insert({
      shs_id: a,
      shs_name: b,
      shop_id: c,
      pw: d,
    })
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post("/probs/_shs/edit", async ctx => {
  try {
    let { id, a, b, c, d } = ctx.request.body
    if ([id, b, c].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }
    const res = await knx("shs_shop_relation")
      .where({ id })
      .update({
        shs_id: a,
        shs_name: b,
        shop_id: c,
        pw: d,
      })
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post("/probs/_shs/del", async ctx => {
  try {
    let { id } = ctx.request.body
    if ([id].some(v => v == null || v == "")) {
      ctx.body = { e: "表单不合法" }
      return
    }
    const res = await knx("shs_shop_relation")
      .where({ id })
      .delete()
    ctx.body = { res }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.get("/probs/ao", async ctx => {
  try {
    let [data, _] = await knx.raw(百亿补贴没有报名)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ao" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.by_name}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${v.by_name}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ap", async ctx => {
  try {
    let [data, _] = await knx.raw(单产品满减问题)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ap" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.tagName}:${v.name}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${v.tagName}:${v.name}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/aq", async ctx => {
  try {
    let [data, _] = await knx.raw(饿了么其它活动检查)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "aq" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.超级吃货红包}:${v.下单返红包}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${v.超级吃货红包}:${v.下单返红包}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/probs/ar", async ctx => {
  try {
    let [data, _] = await knx.raw(美团其它活动检查)
    let handles = await knx("test_prob_t_")
      .select()
      .where({ type: "ar" })
    ctx.body = {
      res: data.map((v, i) => ({
        ...v,
        key: `${v.shop_id}:${v.收藏有礼}:${v.店内领券}`,
        handle: handles.find(h => h.key == `${v.shop_id}:${v.收藏有礼}:${v.店内领券}`)?.handle,
      })),
    }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/shopActsDiff", async ctx => {
  try {
    let data = await knx("test_change_t_")
      .select()
      .whereBetween("change_date", [
        dayjs()
          .subtract(15, "day")
          .format("YYYYMMDD"),
        dayjs().format("YYYYMMDD"),
      ])
    data = data.map(v => ({ ...v, after_rule: JSON.parse(v.after_rule), before_rule: JSON.parse(v.before_rule) }))
    if (!data.find(v => dayjs(v.change_date, "YYYYMMDD").isSame(dayjs(), "day"))) {
      data = await shopActsDiff()
    }
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/saveShopActsDiff", async ctx => {
  try {
    let { key, handle } = ctx.request.body
    if (!key) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await saveShopActsDiff(key, handle)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/saveProbs", async ctx => {
  try {
    let { type, key, handle } = ctx.request.body
    if (!type || key == null) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await saveProbs(type, key, handle)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/saveFreshA", async ctx => {
  try {
    let { wmPoiId, a2, updated_at } = ctx.request.body
    if (!wmPoiId || !updated_at) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await saveFreshA(wmPoiId, a2, updated_at)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/notes", async ctx => {
  try {
    let data = await knx("test_notes_t_")
      .select()
      .orderBy("updated_at", "desc")
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/saveNote", async ctx => {
  try {
    let { key, title, description, content, images } = ctx.request.body
    if (!content) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await saveNote(key, title, description, content, images)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post("/likeNote", async ctx => {
  try {
    let { key } = ctx.request.body
    if (!key) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await likeNote(key, ctx.request.ip)
    ctx.body = { res }
  } catch (e) {
    ctx.body = { e }
  }
})

router.post("/commentNote", async ctx => {
  try {
    let { key, comment } = ctx.request.body
    if (!key || !comment) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await commentNote(key, ctx.request.ip, comment)
    ctx.body = { res }
  } catch (e) {
    ctx.body = { e }
  }
})

router.post("/delNote", async ctx => {
  try {
    let { key } = ctx.request.body
    if (!key) {
      ctx.body = { e: "invalid params" }
      return
    }
    const res = await delNote(key)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get("/freshas", async ctx => {
  try {
    let data = await knx("new_shop_track_copy1").select()
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

koa.use(router.routes())

koa.listen(9005, () => console.log("running at 9005"))

const date_sql = d =>
  `SELECT * FROM test_analyse_t_ WHERE date = DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${d} DAY),'%Y%m%d')`

const sum_sql0 = `
  DROP TABLE IF EXISTS test_shop_temp_;
  CREATE TABLE test_shop_temp_ AS (
    WITH shop_info AS (
      SELECT shop_id, shop_name  FROM ele_info_manage WHERE status = 0 UNION ALL
      SELECT wmpoiid, reptile_type FROM foxx_shop_reptile WHERE status = 0
    ),
    real_shop_info1 AS (
      SELECT
        x.shop_id,
        x1.shop_name,
        x.platform,
        y.shop_address city,
        y.real_shop_name,
        u.nick_name person,
        u2.nick_name leader,
        new_shop,
        y.room_rentals AS rent,
        y.staff_accom,
        y.water_electr,
        4500 AS estimate_employee_wage,
        IF(new_shop = 1, '雷朝宇', null) new_person
      FROM
        platform_shops x
        JOIN base_physical_shops y ON x.physical_id = y.id
        JOIN shop_info x1 ON x1.shop_id = x.shop_id
        LEFT JOIN sys_user u ON u.user_id = y.user_id
        LEFT JOIN sys_user u2 ON u2.user_id = y.leader_id
    ),
    real_shop_info2 AS (
      SELECT *, GROUP_CONCAT(shop_name) AS full_shop_name
      FROM real_shop_info1 
      GROUP BY real_shop_name
    )
    SELECT r1.*, r2.full_shop_name, IF(LOCATE('贡茶', r2.full_shop_name) > 0 AND LOCATE('甜品', r2.full_shop_name) > 0, 5, 3) AS estimate_staff_cnt
    FROM real_shop_info1 r1
    LEFT JOIN real_shop_info2 r2 USING(real_shop_name)
  );
  WITH a AS(
    SELECT t.city, t.person, t.leader, t.real_shop, t.income_sum, t.consume_sum, t.consume_sum_ratio, t.cost_sum, t.cost_sum_ratio, t.date, IFNULL(r.rent / DAY(LAST_DAY(date)), 0) AS rent_cost, r.estimate_staff_cnt, r.estimate_employee_wage, r.staff_accom, r.water_electr, r.rent
    FROM test_analyse_t_ t
    LEFT JOIN test_shop_temp_ r ON t.real_shop = r.real_shop_name
    GROUP BY real_shop, date 
  ),
  b AS (
    SELECT *, SUM(income_sum) OVER w AS income_sum_sum, 
      SUM(consume_sum) OVER w AS consume_sum_sum, 
      SUM(cost_sum) OVER w AS cost_sum_sum,
      SUM(income_sum) OVER (w2 ROWS BETWEEN  CURRENT ROW AND 14 FOLLOWING) AS income_sum_15
    FROM a
    WINDOW w AS (PARTITION BY date),
      w2 AS (PARTITION BY real_shop ORDER BY date DESC)
  ),
  c AS (
    SELECT *, 
  -- 		(IF(staff_cnt = 0 OR employee_wage = 0, 
  -- 			GREATEST(ROUND(income_sum_15 * 2 / 30000), 4) * 4500 , 
  -- 			staff_cnt * employee_wage) + staff_accom) / DAY(LAST_DAY(date)) AS labor_cost,
      (GREATEST(ROUND(income_sum_15 * 2 / 30000), estimate_staff_cnt) * estimate_employee_wage + staff_accom)
        / DAY(LAST_DAY(date)) AS labor_cost,
      IF(water_electr = 0, income_sum * 0.05, water_electr / DAY(LAST_DAY(date))) AS water_electr_cost,
      income_sum * 0.015 AS cashback_cost,
      income_sum * 0.06 AS oper_cost
      FROM b
  ),
  d AS (
    SELECT *, EXTRACT(YEAR_MONTH FROM date) AS ym, 
      income_sum - consume_sum - cost_sum - rent_cost - labor_cost - water_electr_cost - cashback_cost - oper_cost AS profit
    FROM c
  ),
  e AS (
    SELECT *, 
      SUM(income_sum) OVER w AS income_sum_month,
      SUM(consume_sum) OVER w AS consume_sum_month,
      SUM(consume_sum) OVER w / SUM(income_sum) OVER w AS consume_sum_ratio_month,
      SUM(cost_sum) OVER w AS cost_sum_month,
      SUM(cost_sum) OVER w / SUM(income_sum) OVER w AS cost_sum_ratio_month,
      IF(ym = EXTRACT(YEAR_MONTH FROM CURRENT_DATE) OR rent = 0, SUM(rent_cost) OVER w, rent) AS rent_cost_month,
      IF(ym = EXTRACT(YEAR_MONTH FROM CURRENT_DATE), SUM(labor_cost) OVER w, 
        (GREATEST(ROUND(income_sum_15 * 2 / 30000), estimate_staff_cnt) * estimate_employee_wage + staff_accom)) AS labor_cost_month,
      IF(ym = EXTRACT(YEAR_MONTH FROM CURRENT_DATE) OR water_electr = 0, SUM(water_electr_cost) OVER w, water_electr) AS water_electr_cost_month,
      SUM(cashback_cost) OVER w AS cashback_cost_month,
      SUM(oper_cost) OVER w AS oper_cost_month,
      SUM(profit) OVER w AS profit_month
    FROM d
    WINDOW w AS (PARTITION BY real_shop, ym)
  )`

const sum_sql = d => `
    DROP TABLE IF EXISTS test_shop_temp_;
    CREATE TABLE test_shop_temp_ AS (
      WITH shop_info AS (
        SELECT shop_id, shop_name  FROM ele_info_manage WHERE status = 0 UNION ALL
        SELECT wmpoiid, reptile_type FROM foxx_shop_reptile WHERE status = 0
      ),
      real_shop_info1 AS (
        SELECT
          x.shop_id,
          x1.shop_name,
          x.platform,
          y.shop_address city,
          y.real_shop_name,
          u.nick_name person,
          u2.nick_name leader,
          new_shop,
          y.room_rentals AS rent,
          y.staff_accom,
          y.water_electr,
          4500 AS estimate_employee_wage,
          IF(new_shop = 1, '雷朝宇', null) new_person
        FROM
          platform_shops x
          JOIN base_physical_shops y ON x.physical_id = y.id
          JOIN shop_info x1 ON x1.shop_id = x.shop_id
          LEFT JOIN sys_user u ON u.user_id = y.user_id
          LEFT JOIN sys_user u2 ON u2.user_id = y.leader_id
      ),
      real_shop_info2 AS (
        SELECT *, GROUP_CONCAT(shop_name) AS full_shop_name
        FROM real_shop_info1 
        GROUP BY real_shop_name
      )
      SELECT r1.*, r2.full_shop_name, IF(LOCATE('贡茶', r2.full_shop_name) > 0 AND LOCATE('甜品', r2.full_shop_name) > 0, 5, 3) AS estimate_staff_cnt
      FROM real_shop_info1 r1
      LEFT JOIN real_shop_info2 r2 USING(real_shop_name)
    );
    WITH 
    test_analyse AS (-- 营推
      SELECT
        DISTINCT
        city,
        person,
        leader,
        real_shop,
        income_sum,
        consume_sum,
        consume_sum_ratio,
        cost_sum,
        cost_sum_ratio,
        date
      FROM test_analyse_t_
      WHERE date >= DATE_FORMAT( DATE_SUB( CURDATE(), INTERVAL 37 DAY ), '%Y%m%d' )
    ),
    test_shop_temp AS (
      SELECT
        real_shop_name,
        estimate_staff_cnt,
        estimate_employee_wage,
        staff_accom,
        water_electr,
        rent 
      FROM test_shop_temp_ 
      GROUP BY real_shop_name
    ),
    a AS(
      SELECT
        t.city,
        t.person,
        t.leader,
        t.real_shop,
        t.income_sum,
        t.consume_sum,
        t.consume_sum_ratio,
        t.cost_sum,
        t.cost_sum_ratio,
        t.date,
        IFNULL( rent / DAY ( LAST_DAY( date )), 0 ) AS rent_cost,
        r.estimate_staff_cnt,
        r.estimate_employee_wage,
        r.staff_accom,
        r.water_electr,
        r.rent 
      FROM
        test_analyse t
        LEFT JOIN test_shop_temp r ON t.real_shop = r.real_shop_name
    ),
    b AS (
        SELECT *, 
          SUM(income_sum) OVER w AS income_sum_sum, 
          SUM(consume_sum) OVER w AS consume_sum_sum, 
          SUM(cost_sum) OVER w AS cost_sum_sum,
          SUM(income_sum) OVER (w2 ROWS BETWEEN  CURRENT ROW AND 14 FOLLOWING) AS income_sum_15,
          SUM(income_sum) OVER (w2 ROWS BETWEEN CURRENT ROW AND 2 FOLLOWING) AS income_sum_3
        FROM a
        WINDOW w AS (PARTITION BY date),
          w2 AS (PARTITION BY real_shop ORDER BY date DESC)
    ),
    c AS (
      SELECT
        *,
    -- 		(IF(
    -- 			staff_cnt = 0 OR employee_wage = 0,
    -- 			GREATEST(ROUND(income_sum_15 * 2 / 30000), 4) * 4500 ,
    -- 			staff_cnt * employee_wage) + staff_accom
    -- 		) / DAY(LAST_DAY(date)) AS labor_cost,
        ( GREATEST( ROUND( income_sum_15 * 2 / 30000 ), estimate_staff_cnt ) * estimate_employee_wage + staff_accom ) / DAY (
        LAST_DAY( date )) AS labor_cost,
        IF(
          water_electr = 0,
          income_sum * 0.05,
          water_electr / DAY (LAST_DAY( date ))
        ) AS water_electr_cost,
        income_sum * 0.015 AS cashback_cost,
        income_sum * 0.06 AS oper_cost 
      FROM b
    ),
    d AS (
      SELECT
        *,
        EXTRACT( YEAR_MONTH FROM date ) AS ym,
        income_sum - consume_sum - cost_sum - rent_cost - labor_cost - water_electr_cost - cashback_cost - oper_cost AS profit 
      FROM c
    ),
    e AS (
      SELECT
        *,
        SUM( income_sum ) OVER w AS income_sum_month,
        SUM( consume_sum ) OVER w AS consume_sum_month,
        SUM( consume_sum ) OVER w / SUM( income_sum ) OVER w AS consume_sum_ratio_month,
        SUM( cost_sum ) OVER w AS cost_sum_month,
        SUM( cost_sum ) OVER w / SUM( income_sum ) OVER w AS cost_sum_ratio_month,
        IF( 
          ym = EXTRACT( YEAR_MONTH FROM CURRENT_DATE ) OR rent = 0, 
          SUM( rent_cost ) OVER w, 
          rent
        ) AS rent_cost_month,
        IF(
          ym = EXTRACT( YEAR_MONTH FROM CURRENT_DATE ),
          SUM( labor_cost ) OVER w,
          ( GREATEST( ROUND( income_sum_15 * 2 / 30000 ), estimate_staff_cnt ) * estimate_employee_wage + staff_accom )
        ) AS labor_cost_month,
        IF( 
          ym = EXTRACT( YEAR_MONTH FROM CURRENT_DATE ) OR water_electr = 0,
          SUM( water_electr_cost ) OVER w,
          water_electr
        ) AS water_electr_cost_month,
        SUM( cashback_cost ) OVER w AS cashback_cost_month,
        SUM( oper_cost ) OVER w AS oper_cost_month,
        SUM( profit ) OVER w AS profit_month 
      FROM d 
      WINDOW w AS (PARTITION BY real_shop,ym)
    ),
    f AS (
      SELECT
        *,
        consume_sum_sum / income_sum_sum AS consume_sum_sum_ratio,
        cost_sum_sum / income_sum_sum AS cost_sum_sum_ratio,
        IFNULL(AVG(profit) OVER(PARTITION BY real_shop ORDER BY date DESC ROWS BETWEEN CURRENT ROW AND 30 FOLLOWING ), 0) 30_days_before_profit
      FROM e 
      WHERE date >= DATE_FORMAT( DATE_SUB( CURDATE(), INTERVAL 37 DAY ), '%Y%m%d' ) 
      ORDER BY
        date DESC,
        income_sum DESC
    )
    SELECT
      *,
      ( profit - 30_days_before_profit ) / 30_days_before_profit month_on_month_ratio_profit 
    FROM f 
    WHERE date >= DATE_FORMAT( DATE_SUB( CURDATE(), INTERVAL ${d} DAY ), '%Y%m%d' )`

const sum_sql2 = `
  ${sum_sql0}
  SELECT city, person, leader, real_shop,income_sum_month, consume_sum_month, consume_sum_ratio_month, cost_sum_month, cost_sum_ratio_month,
  rent_cost_month, labor_cost_month, water_electr_cost_month, cashback_cost_month, oper_cost_month, profit_month, ym 
  FROM e 
  GROUP BY real_shop, ym ORDER BY ym DESC
`

const fresh_sql = `
    SELECT a.*, a.turnover - IFNULL(h.third_send, 0) AS income, e.cost_ratio, IFNULL(b.shop_name, c.reptile_type) AS name, IF(f.platform = 1, '美团', '饿了么') AS platform,
    f.person, f.leader, f.real_shop_name, g.a2
    FROM foxx_new_shop_track a
    LEFT JOIN ele_info_manage b ON a.wmpoiid = b.shop_id 
    LEFT JOIN foxx_shop_reptile c USING(wmpoiid)
    LEFT JOIN foxx_new_shop d ON a.wmpoiid = d.shop_id
    LEFT JOIN foxx_operating_data e ON a.wmpoiid = e.shop_id AND a.date = e.date
    LEFT JOIN test_shop_ f ON a.wmpoiid = f.shop_id 
    LEFT JOIN new_shop_track_copy1 g ON a.wmpoiid = g.wmpoiid AND a.date = DATE_FORMAT(DATE_SUB(g.updated_at,INTERVAL 1 DAY), '%Y%m%d')
    LEFT JOIN wmb_expend h ON a.wmpoiid = h.shop_id AND a.date = DATE_FORMAT(DATE_SUB(h.insert_date,INTERVAL 1 DAY), '%Y%m%d')
    WHERE (b.shop_name IS NOT NULL OR c.reptile_type IS NOT NULL) AND f.new_shop = 1
    ORDER BY a.wmpoiid, a.date DESC`

const export_fresh_sql_csv = `
  WITH real_shop_info AS (
    SELECT
      x.shop_id,
  -- 	x1.dict_label shop_name,
      x.platform,
      y.shop_address city,
      y.real_shop_name,
      z.nick_name person,
      new_shop,
      IF(new_shop = 1, '雷朝宇', null) new_person
    FROM
      platform_shops x
      JOIN base_physical_shops y ON x.physical_id = y.id
      JOIN sys_user z ON y.user_id = z.user_id
      JOIN sys_dict_data x1 ON x1.dict_type = "shop_name" AND x1.dict_value = x.shop_id
  )
  SELECT IFNULL(b.shop_name, c.reptile_type) AS 门店, IF(f.platform = 1, '美团', '饿了么') AS 平台, f.new_person 负责人,
    a.evaluate 评论数, a.bad_order 差评数, a.order 单量, a.evaluate/a.order 评价率, a.bizScore 评分,
    a.moment 推广, a.turnover - IFNULL(h.third_send, 0) AS 营业额, a.unitPrice 客单价, a.overview 曝光量,
    a.Entryrate 进店率, a.Orderrate 下单率, e.cost_ratio 成本比例, a.off_shelf 下架产品量, a.over_due_date 特权有效期,
    a.kangaroo_name 袋鼠店长, a.red_packet_recharge 高佣返现, a.ranknum 商圈排名, a.extend 延迟发单, g.a2 优化
    FROM foxx_new_shop_track a
    LEFT JOIN ele_info_manage b ON a.wmpoiid = b.shop_id 
    LEFT JOIN foxx_shop_reptile c USING(wmpoiid)
    LEFT JOIN foxx_new_shop d ON a.wmpoiid = d.shop_id
    LEFT JOIN foxx_operating_data e ON a.wmpoiid = e.shop_id AND a.date = e.date
    LEFT JOIN real_shop_info f ON a.wmpoiid = f.shop_id 
    LEFT JOIN new_shop_track_copy1 g ON a.wmpoiid = g.wmpoiid AND DATE_FORMAT(DATE_SUB(g.updated_at,INTERVAL 1 DAY), '%Y%m%d') = a.date
    LEFT JOIN wmb_expend h ON a.wmpoiid = h.shop_id AND a.date = DATE_FORMAT(DATE_SUB(h.insert_date,INTERVAL 1 DAY), '%Y%m%d')
    WHERE (b.shop_name IS NOT NULL OR c.reptile_type IS NOT NULL)
    AND f.new_person IS NOT NULL 
    ORDER BY a.wmpoiid, a.date DESC`

const export_fresh_sql = `
    WITH real_shop_info AS (
      SELECT
        x.shop_id,
    -- 	x1.dict_label shop_name,
        x.platform,
        y.shop_address city,
        y.real_shop_name,
        z.nick_name person,
        new_shop,
        IF(new_shop = 1, '雷朝宇', null) new_person
      FROM
        platform_shops x
        JOIN base_physical_shops y ON x.physical_id = y.id
        JOIN sys_user z ON y.user_id = z.user_id
        JOIN sys_dict_data x1 ON x1.dict_type = "shop_name" AND x1.dict_value = x.shop_id
    )
    SELECT a.*, a.turnover - IFNULL(h.third_send, 0) AS income, e.cost_ratio, 
      IFNULL(b.shop_name, c.reptile_type) AS name, IF(f.platform = 1, '美团', '饿了么') AS platform, f.new_person, f.person, g.a2,
      IFNULL(i.exposureCnt, j.expuv_top10) t10_exposure, IFNULL(i.visitCnt/i.exposureCnt, j.clkratio_top10) t10_visit_rate, IFNULL(i.orderCnt/i.visitCnt, j.validorderratio_top10) t10_order_rate
    FROM foxx_new_shop_track a
    LEFT JOIN ele_info_manage b ON a.wmpoiid = b.shop_id 
    LEFT JOIN foxx_shop_reptile c USING(wmpoiid)
    LEFT JOIN foxx_new_shop d ON a.wmpoiid = d.shop_id
    LEFT JOIN foxx_operating_data e ON a.wmpoiid = e.shop_id AND a.date = e.date
    LEFT JOIN real_shop_info f ON a.wmpoiid = f.shop_id 
    LEFT JOIN new_shop_track_copy1 g ON a.wmpoiid = g.wmpoiid AND DATE_FORMAT(DATE_SUB(g.updated_at,INTERVAL 1 DAY), '%Y%m%d') = a.date
    LEFT JOIN wmb_expend h ON a.wmpoiid = h.shop_id AND a.date = DATE_FORMAT(DATE_SUB(h.insert_date,INTERVAL 1 DAY), '%Y%m%d')
    LEFT JOIN foxx_busin_passenger_flow i ON a.wmpoiid = i.wmpoiid AND a.date = i.date
    LEFT JOIN ele_flows_trend j ON a.wmpoiid = j.shop_id AND a.date = DATE_FORMAT(j.date, '%Y%m%d')
    WHERE (b.shop_name IS NOT NULL OR c.reptile_type IS NOT NULL)
    AND f.new_person IS NOT NULL 
    ORDER BY a.wmpoiid, a.date DESC`

const perf_sql = (d, djh = 1) => `WITH a AS (
    SELECT city, person, leader, real_shop, income_sum, income_avg, income_score, cost_sum, cost_avg, cost_sum_ratio, cost_score, consume_sum, consume_avg, consume_sum_ratio, consume_score, score, date
    FROM test_analyse_t_ ${djh == 0 ? "WHERE shop_name NOT LIKE '%大计划%'" : ""}
    GROUP BY real_shop, date ORDER BY date DESC
  ),
  b AS (
    SELECT *,
      SUM(cost_sum) OVER w / SUM(income_sum) OVER w AS cost_sum_sum_ratio,
      SUM(consume_sum) OVER w / SUM(income_sum) OVER w AS consume_sum_sum_ratio,
      SUM(income_sum) OVER w AS income_sum_sum,
      AVG(income_avg) OVER w AS income_avg_avg,
      AVG(income_score) OVER w AS income_score_avg,
      SUM(cost_sum) OVER w AS cost_sum_sum,
      AVG(cost_avg) OVER w AS cost_avg_avg,
      AVG(cost_sum_ratio) OVER w AS cost_sum_ratio_avg,
      AVG(cost_score) OVER w AS cost_score_avg,
      SUM(consume_sum) OVER w AS consume_sum_sum,
      AVG(consume_avg) OVER w AS consume_avg_avg,
      AVG(consume_sum_ratio) OVER w AS consume_sum_ratio_avg,
      AVG(consume_score) OVER w AS consume_score_avg,
      AVG(score) OVER w AS score_avg
    FROM a
    WINDOW w AS (PARTITION BY person, date ORDER BY date DESC)
  ),
  b2 AS (
    SELECT *, 
      AVG(cost_sum_sum_ratio) OVER w AS cost_sum_sum_ratio_avg,
      AVG(consume_sum_sum_ratio) OVER w AS consume_sum_sum_ratio_avg
    FROM b
    WINDOW w AS (PARTITION BY person, date ORDER BY date DESC)
  ),
  c AS (
    SELECT *,
      income_score - LEAD(income_score, 1) OVER w2 AS income_score_1,
      cost_score - LEAD(cost_score, 1) OVER w2 AS cost_score_1,
      consume_score - LEAD(consume_score, 1) OVER w2 AS consume_score_1,
      score - LEAD(score, 1) OVER w2 AS score_1,
      score_avg - LEAD(score_avg, 1) OVER w2 AS score_avg_1
    FROM b2
    WINDOW w2 AS (PARTITION BY real_shop ORDER BY date DESC)
  ),
  c2 AS (
    SELECT *,
      AVG(income_score_1) OVER w AS income_score_1_avg,
			AVG(cost_score_1) OVER w AS cost_score_1_avg,
			AVG(consume_score_1) OVER w AS consume_score_1_avg,
      AVG(score_1) OVER w AS score_1_avg,
      AVG(score_avg_1) OVER w AS score_avg_1_avg
    FROM c
    WINDOW w AS (PARTITION BY person, date ORDER BY date DESC)
  )
  SELECT * FROM c2
  WHERE date >= DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${d} DAY),'%Y%m%d')
  ORDER BY date DESC`

const op_sql = d => `SELECT city, person, leader, real_shop, shop_id, shop_name, platform, third_send, unit_price, orders, income, income_avg, income_sum,
  cost, cost_avg, cost_sum, cost_ratio, cost_sum_ratio, 
  consume, consume_avg, consume_sum, consume_ratio, consume_sum_ratio, 
    settlea_30, settlea_1, settlea_7, settlea_7_3, date
  FROM test_analyse_t_ 
  WHERE date >= DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${d} DAY),'%Y%m%d')
  ORDER BY date`

const commision_sql = `SELECT *, date 日期, sum(a.提成) OVER( PARTITION BY DATE_FORMAT(date,"%Y%m"), 运营 ) 月累计提成 FROM
    (
    SELECT
    "组员" 级别,
    person 运营,
    sum( income_sum ) 收入,
    sum( consume_sum ) / sum( income_sum ) 推广比例,
    sum( cost_sum ) / sum( income_sum ) 成本比例,
    sum( profit ) 利润,
    0.02 * 0.4 * sum( profit ) 提成,
    date
    FROM
    v_physical_shop_profit 
    WHERE
    date >= 20210801 AND date < 20210923
    AND leader IS NOT NULL
    GROUP BY
    person,
    date
    UNION ALL
    SELECT
    "组长",
    leader,
    sum( income_sum ),
    sum( consume_sum ) / sum( income_sum ),
    sum( cost_sum ) / sum( income_sum ),
    sum( profit ),
    0.02 * 0.6 * sum( profit ),
    date
    FROM
    v_physical_shop_profit 
    WHERE
    date >= 20210801 AND date < 20210923
    AND leader IS NOT NULL
    GROUP BY
    leader,
    date
    ) a
    ORDER BY date, 运营`

const commision_sql2 = `SELECT *, sum(提成) over(PARTITION BY 运营, DATE_FORMAT(日期,'%y%m')) AS '月累计提成'
    FROM (
    SELECT
      "组员" 级别,
      person AS '运营',
      sum(income_sum) AS '收入',
      sum(cost_sum)  / 
      sum(income_sum) AS '成本比例',
      sum(consume_sum) / 
      sum(income_sum) AS '推广比例',
      sum(profit) AS '利润',
      sum(profit) * 0.02 AS '提成',
      date AS '日期'
    FROM
      v_physical_shop_profit 
    WHERE
      date >= 20210923
    GROUP BY
      person,
      date
    ) shop_profit`

const 美团成本问题 = (id, date) => `SET @date = ${date};
    SET @shop_id = ${id};

    WITH
    a AS (
      SELECT 
        wmpoiid,
        F_GET_SHOP_NAME(wmPoiid) shop_name,
        wm_order_id_view_str order_id,
        details,
        settleAmount,
        goods_count,
        cost_sum,
      CASE
      WHEN goods_count BETWEEN 1 AND 3 THEN
        goods_count
      WHEN goods_count < 1 THEN
        0
      ELSE
        4
      END goods_cnt
      FROM foxx_order_manag_historical
      WHERE
        date = DATE_FORMAT( DATE_ADD(@date, INTERVAL 1 DAY), "%Y%m%d")
    -- 		填写id
        AND wmpoiid = @shop_id	
        AND ( 
          cancel_reason = '' OR
          cancel_reason IS NULL
        )
    ),
    b AS (
      SELECT 
        order_id,
        CASE 
        WHEN activi_info LIKE '%现价%' THEN
          '折扣'
        ELSE
          '满减'
        END activi
      FROM foox_order_his 
      WHERE 
        date = @date
    -- 		填写id
        AND shop_id = @shop_id
    ),
    c AS (
    -- 加入第三方配送费
      SELECT
        shop_id,
        third_send / orders AS third_send 
      FROM
        foxx_operating_data 
      WHERE
        date = @date
        AND platform = '美团'
    ),
    d AS (
      SELECT 
        wmpoiid,
        shop_name,
        goods_cnt,
        activi,
    -- 		a.order_id,
        SUM(cost_sum) cost,
        SUM(settleAmount - third_send) settlea,
        count(*) order_cnt,
        third_send
      FROM a JOIN b ON a.order_id = b.order_id
      JOIN c ON a.wmpoiid = c.shop_id
      GROUP BY goods_cnt, activi
    )
    SELECT 
      wmpoiid shop_id,
      shop_name,
      activi '活动',
      goods_cnt '商品数',
      order_cnt '单量',
      order_cnt / SUM(order_cnt) OVER() AS '单量占比',
      cost '成本',
      settlea '收入',
      third_send "单均配送",
      cost / settlea AS '成本比例'
    FROM d
    ORDER BY 活动, 商品数`

const 饿了么成本问题 = (id, date) => `SET @date = DATE_FORMAT(DATE_ADD(${date}, INTERVAL 1 DAY), '%Y%m%d');
    SET @shop_id = ${id};

    WITH a AS (
      SELECT
        shop_id,
        shop_name,
        order_id,
        order_detail,
        order_income,
        CASE
        WHEN goods_count BETWEEN 1 AND 3 THEN
          goods_count
        WHEN goods_count < 1 THEN
          0
        ELSE
          4
        END goods_cnt,
        cost_sum
      FROM
        ele_order_manag 
      WHERE
        shop_id = @shop_id AND
        bach_date = @date
    ),
    b AS ( 
    -- 判断活动类型
      SELECT
        shop_id,
        order_id,
        CASE
        WHEN fees_name = "店铺满减" THEN "满减"
        WHEN fees_name LIKE "单品特价%" THEN "折扣"
        ELSE "无活动"
        END act
      FROM
        ele_order_settlement 
      WHERE
        bach_date = @date 
        AND shop_id = @shop_id 
        AND (
          fees_name LIKE "单品特价%" 
          OR fees_name = "店铺满减" 
        )
      GROUP BY order_id
    ),
    c AS (
    -- 加入第三方配送费
      SELECT
        shop_id,
        third_send / orders AS third_send 
      FROM
        foxx_operating_data 
      WHERE
        date = DATE_FORMAT( DATE_SUB( @date, INTERVAL 1 DAY ), "%Y%m%d")
        AND platform = '饿了么'
    ),
    d AS (
      SELECT 
        a.shop_id,
        a.shop_name, 
        b.act 活动, 
        a.goods_cnt 商品数,
        count(*) OVER(PARTITION BY act, goods_cnt) 单量,
        count(*) OVER(PARTITION BY act, goods_cnt) / count(*) OVER()单量占比,
        SUM(cost_sum) OVER(PARTITION BY act, goods_cnt) 成本, 
        SUM(order_income - third_send) OVER(PARTITION BY act, goods_cnt) 收入,
        third_send 单均配送,
        SUM(cost_sum) OVER(PARTITION BY act, goods_cnt) / SUM(order_income - third_send) OVER(PARTITION BY act, goods_cnt) 成本比例
      FROM 
      a 
        LEFT JOIN b 
          ON a.order_id = b.order_id 
        JOIN c 
          ON a.shop_id = c.shop_id
    )
    SELECT * FROM d GROUP BY 活动, 商品数`

const 美团单维度订单 = (id, activi, counts, date) => `SET @date = ${date};
    SET @shop_id = ${id};

    WITH
    a AS (
      SELECT 
        wmpoiid,
        F_GET_SHOP_NAME(wmPoiid) shop_name,
        wm_order_id_view_str order_id,
        details,
        settleAmount,
        CASE
        WHEN goods_count BETWEEN 1 AND 3 THEN
          goods_count
        WHEN goods_count < 1 THEN
          0
        ELSE
          4
        END goods_count,
          cost_sum
      FROM foxx_order_manag_historical
      WHERE
        date = DATE_FORMAT( DATE_ADD(@date, INTERVAL 1 DAY), "%Y%m%d")
        AND wmpoiid = @shop_id
        AND ( 
          cancel_reason = '' OR
          cancel_reason IS NULL
        )
    ),
    b AS (
      SELECT 
        order_id, 
        CASE 
        WHEN activi_info LIKE '%现价%' THEN
          '折扣'
        ELSE
          '满减'
        END activi
      FROM foox_order_his WHERE date = @date
    ),
    c AS (
      SELECT
        shop_id,
        third_send / orders AS third_send 
      FROM
        foxx_operating_data 
      WHERE
        date = @date
        AND platform = '美团'
    ),
    d AS (
      SELECT 
        shop_id,
        shop_name,
        a.order_id 订单id,
        activi 活动,
        goods_count 商品数,
        details 订单信息,
        cost_sum 成本,
        settleAmount - third_send 收入,
        third_send 单均配送,
        cost_sum / settleAmount 成本比例
      FROM a JOIN b ON a.order_id = b.order_id
      JOIN c ON a.wmpoiid = c.shop_id
    )
    SELECT * FROM d
    WHERE 
      活动 = '${activi}' AND
      商品数 = ${counts}
    ORDER BY 成本 / 收入 DESC`

const 饿了么维度订单 = (
  id,
  activi,
  counts,
  date
) => `SET @date = DATE_FORMAT(DATE_ADD(${date}, INTERVAL 1 DAY), '%Y%m%d');
      SET @shop_id = ${id};

      WITH a AS (
        SELECT
          shop_id,
          shop_name,
          order_id,
          order_detail,
          order_income,
          CASE
          WHEN goods_count BETWEEN 1 AND 3 THEN
            goods_count
          WHEN goods_count < 1 THEN
            0
          ELSE
            4
          END goods_cnt,
          cost_sum
        FROM
          ele_order_manag 
        WHERE
          shop_id = @shop_id AND
          bach_date = @date
      ),
      b AS (
      -- 判断活动类型
        SELECT
          shop_id,
          order_id,
          CASE
          WHEN fees_name = "店铺满减" THEN "满减"
          WHEN fees_name LIKE "单品特价%" THEN "折扣"
          ELSE "无活动"
          END act
        FROM
          ele_order_settlement 
        WHERE
          bach_date = @date 
          AND shop_id = @shop_id 
          AND (
            fees_name LIKE "单品特价%" 
            OR fees_name = "店铺满减" 
          )
        GROUP BY order_id
      ),
      c AS (
      -- 加入第三方配送费
        SELECT
          shop_id,
          third_send / orders AS third_send 
        FROM
          foxx_operating_data 
        WHERE
        date = DATE_FORMAT( DATE_SUB( @date, INTERVAL 1 DAY ), "%Y%m%d")
          AND platform = '饿了么'
      )
      SELECT 
        a.shop_id,
        a.shop_name, 
        b.act 活动,
        a.goods_cnt 商品数,
        a.order_id 订单id,
        a.order_detail 订单信息,
        a.order_income 收入,
        a.cost_sum 成本,
        c.third_send 单均配送,
        a.cost_sum / (a.order_income - c.third_send) 成本比例
      FROM a
        LEFT JOIN b 
          ON a.order_id = b.order_id 
        JOIN c 
          ON a.shop_id = c.shop_id
      WHERE 
        ${activi == null ? "act IS NULL" : `act = '${activi}'`}
        AND goods_cnt = ${counts}
      ORDER BY 成本比例 DESC`

const 维度订单 = (id, date) => `SET @date = ${date};
    SET @shop_id = ${id};

    WITH a AS ( SELECT * FROM order_dimension_info WHERE date = @date AND shop_id = @shop_id ),
    b AS (
      SELECT
        shop_id,
        ROUND( third_send / orders, 2 ) third_send 
      FROM
        foxx_operating_data 
      WHERE
        date = @date
        AND shop_id = @shop_id 
    ),
    c AS (
      SELECT
        shipping_fee,
        settle_amount,
        third_send,
        ROUND( goods_count, 1 ) goods_count,
        cost_sum,
        rule
      FROM
        a
        JOIN b ON a.shop_id = b.shop_id 
      ),
    d AS (
      SELECT
        count(*) order_cnt,
        round( sum( cost_sum ), 2 ) cost_sum,
        round( sum( settle_amount - third_send ), 2 ) settle_sum,
        round( third_send, 2 ) third_send,
        goods_count,
        round( sum( shipping_fee ), 2 ) shipping_fee,
        rule
      FROM
        c 
      GROUP BY
        goods_count,
        rule 
      )
    SELECT
      goods_count 商品数量,
      rule 活动内容,
      cost_sum 理论成本,
      settle_sum 商家收入,
      CONCAT( ROUND(( 100 * cost_sum / settle_sum ), 2 ), '%' ) 成本比例,
      third_send 单均配送,
      order_cnt 订单数量,
      CONCAT( ROUND(( 100 * order_cnt / sum( order_cnt ) over () ), 2 ), '%' ) 订单比例 
    FROM
      d 
    ORDER BY
      goods_count,
      rule`

const 维度订单详情 = (id, activi, counts, date) => `SET @date = ${date};
    SET @shop_id = ${id};

    WITH a AS ( SELECT * FROM order_dimension_info WHERE date = @date AND shop_id = @shop_id ),
    b AS (
      SELECT
        shop_id,
        ROUND( third_send / orders, 2 ) third_send 
      FROM
        foxx_operating_data 
      WHERE
        date = @date
        AND shop_id = @shop_id 
    )
    SELECT
      order_id 订单编号,
      details 订单信息,
      cost_sum 理论成本,
      settle_amount - third_send 商家收入,
      ROUND(( 100 * cost_sum / (settle_amount - third_send) ), 2 ) cost_ratio,
      CONCAT( ROUND(( 100 * cost_sum / (settle_amount - third_send) ), 2 ), '%' ) 成本比例,
      GREATEST(shipping_fee, third_send) 订单配送,
      jp_fee 减配支出,
      xk_fee 新客立减,
      hb_fee 红包支出,
      dj_fee 代金券支出,
      distance '订单距离/m'
    FROM
      a JOIN b 
      ON a.shop_id = b.shop_id
      AND ${counts == null ? "goods_count IS NULL" : "ROUND( goods_count, 1 ) = " + counts}
      AND rule = '${activi}'
    ORDER BY cost_ratio DESC`

const 线下指标美团评分 = (id, d = 7) => `SELECT 
    -- 评分
    bizscore,
    --  时间统一到数据当天
    DATE_FORMAT(date, '%Y-%m-%d') date
    FROM
    foxx_cus_manag_analy_score 
    WHERE 
    -- 查看七天评分
    date BETWEEN DATE_SUB(CURDATE(),INTERVAL ${d} DAY) AND DATE_SUB(CURDATE(),INTERVAL 1 DAY) AND
    wmpoiid = ${id}
    ORDER BY date DESC`

const 线下指标饿了么评分 = (id, d = 7) => `SELECT 
    -- 评分
    rating,
    --  时间统一到数据当天
    DATE_FORMAT(insert_date, "%Y-%m-%d") date
    FROM
    ele_rating_log 
    WHERE 
    -- 查看七天评分
    insert_date BETWEEN DATE_SUB(CURDATE(),INTERVAL ${d} DAY) AND CURDATE() AND
    shop_id = ${id}
    ORDER BY insert_date DESC`

const 线下指标美团商责配送延迟率 = (id, d = 7) => `SELECT
    --  商责取消订单
    negotiable_order_cancellation,
    --  配送延迟率
    distribution_delay_rate,
    DATE_FORMAT( date, "%Y-%m-%d") date
    FROM
    foox_mt_sales_information 
    WHERE 
    -- 查看七天
    DATE_ADD( date, INTERVAL 1 day) >= DATE_SUB( CURRENT_DATE, INTERVAL ${d - 1} DAY) AND
    shop_id = ${id}
    ORDER BY date DESC`

const 线下指标美团评价率差评率 = (id, d = 7) => `SELECT
    -- 评论数/订单数 
    a.evaluation_cnt / b.valid_orders evaluation_rate,
    --  差评数/订单数
    IFNULL( c.bad_evaluation_cnt / a.evaluation_cnt, 0 ) bad_evaluation_rate,
    a.date
    FROM 
    (
    SELECT
    count(*) evaluation_cnt,
    DATE_SUB( date, INTERVAL 1 day) date  
    FROM foxx_cus_manag_analy_evaluate
    WHERE 
    date >= DATE_SUB( CURRENT_DATE, INTERVAL ${d} DAY) AND
    wmpoiid = ${id}
    GROUP BY date
    ) a
    JOIN (
    SELECT
      valid_orders,
      DATE_FORMAT( date, "%Y-%m-%d") date
    FROM
      foox_mt_sales_information
    WHERE
      date >= DATE_SUB( CURRENT_DATE, INTERVAL ${d} DAY) AND
      shop_id = ${id}
    ) b
    ON a.date = b.date
    LEFT JOIN (
    SELECT
    count(*) bad_evaluation_cnt,
    DATE_SUB( date, INTERVAL 1 day) date  
    FROM foxx_cus_manag_analy_evaluate
    WHERE 
    date >= DATE_SUB( CURRENT_DATE, INTERVAL ${d} DAY) AND
    wmpoiid = ${id} AND
    order_comment_score < 3
    GROUP BY date
    ) c
    ON a.date = c.date
    ORDER BY a.date DESC`

const 线下指标饿了么评价率差评率 = (id, d = 7) => `SELECT
    -- 评论数/订单数
    evaluation_cnt / valid_orders evaluation_rate,
    --  差评数 / 订单数
    IFNULL( bad_evaluation_cnt / evaluation_cnt , 0 ) bad_evaluation_rate,
    a.date
    FROM
    (
    SELECT
      count(*) evaluation_cnt,
    --   时间统一到数据当天
      DATE_FORMAT( DATE_SUB( insert_date, INTERVAL 1 day), "%Y-%m-%d") date
    FROM 
      ele_rate_result
    WHERE 
      insert_date > DATE_SUB( CURRENT_DATE, INTERVAL ${d - 1} DAY) AND
      shop_id = ${id}
    GROUP BY DATE_FORMAT( insert_date, "%Y-%m-%d")
    ) a
    JOIN (
    SELECT
      valid_orders,
      DATE_FORMAT( date, "%Y-%m-%d") date 
    FROM
      ele_all_shop_data_info
    WHERE
      date >= DATE_SUB( CURRENT_DATE, INTERVAL ${d} DAY) AND
      shop_id = ${id}
    ) b
    ON a.date = b.date
    LEFT JOIN (
    SELECT
      count(*) bad_evaluation_cnt,
    --   时间统一到数据当天
      DATE_FORMAT( DATE_SUB( insert_date, INTERVAL 1 day), "%Y-%m-%d") date 
    FROM 
      ele_rate_result
    WHERE 
      insert_date > DATE_SUB( CURRENT_DATE, INTERVAL ${d - 1} DAY) AND
      shop_id = ${id} AND
    service_rating < 3
    GROUP BY DATE_FORMAT( insert_date, "%Y-%m-%d")
    ) c
    ON a.date = c.date
    ORDER BY a.date DESC`

const 线下指标美团30天评价率 = id => `SELECT
    -- 评论数/订单数 
    a.evaluation_cnt / b.valid_orders evaluation_rate
    FROM 
    (
    SELECT
    count(*) evaluation_cnt
    FROM foxx_cus_manag_analy_evaluate
    WHERE 
    date >= DATE_SUB( CURRENT_DATE, INTERVAL 29 DAY) AND
    wmpoiid = ${id}
    ) a
    JOIN (
    SELECT
      SUM(valid_orders) valid_orders
    FROM
      foox_mt_sales_information
    WHERE
      date >= DATE_SUB( CURRENT_DATE, INTERVAL 30 DAY) AND
      shop_id = ${id}
    ) b`

const 线下指标饿了么30天评价率 = id => `SELECT
    -- 评论数/订单数
    evaluation_cnt / valid_orders evaluation_rate
    FROM
    (
    SELECT
      count(*) evaluation_cnt
    FROM
      ele_rate_result
    WHERE
      insert_date > DATE_SUB( CURRENT_DATE, INTERVAL 29 DAY) AND
      shop_id = ${id}
    ) a
    JOIN (
    SELECT
      SUM(valid_orders) valid_orders
    FROM
      ele_all_shop_data_info
    WHERE
      date >= DATE_SUB( CURRENT_DATE, INTERVAL 30 DAY) AND
      shop_id = ${id}
    ) b`

const 线下指标美团30天商责配送延迟率 = (id, d = 7) => `SELECT 
    -- 30天商责取消次数
    cancelOfPoiResCnt,
    --   30天配送延迟率
    delayRate,
    DATE_FORMAT( date, "%Y-%m-%d") date
    FROM 
    foxx_service_performance_30d
    WHERE
    date >= DATE_SUB(CURRENT_DATE, INTERVAL ${d - 1} DAY) AND
    wmpoiid = ${id}
    ORDER BY date DESC`

const 线下指标美团商品数下架数 = (id, d = 7) => `SELECT
    -- 第二天早上下架的产品数量
    count( sellStatus = '1' OR NULL ) off_shelf_cnt,
    --  第二天早上统计的门店所有产品数量
    count(*) food_cnt,
    DATE_SUB( date, INTERVAL 1 DAY ) date
    FROM foxx_food_manage 
    WHERE 
    date > DATE_SUB( CURRENT_DATE, INTERVAL ${d} DAY ) AND
    wmpoiid = ${id}
    GROUP BY DATE_FORMAT( date, '%Y-%m-%d')
    ORDER BY date DESC`

const 线下指标饿了么商品数下架数 = (id, d = 7) => `SELECT
    -- 第二天早上统计的下架的产品数量
    count( e1.on_shelf = '下架' OR NULL ) off_shelf_cnt,
    --  第二天早上统计的门店所有产品数量
    count(e1.id) food_cnt,
    DATE_SUB( bach_date, INTERVAL 1 DAY ) date
    FROM ele_food_manage e1 -- RIGHT JOIN (SELECT id FROM ele_food_manage) e2 ON e1.id = e2.id
    WHERE 
    e1.bach_date >= DATE_FORMAT(DATE_SUB( CURRENT_DATE, INTERVAL ${d - 1} DAY ), '%Y%m%d') AND
    e1.shop_id = ${id}
    GROUP BY e1.bach_date
    ORDER BY e1.bach_date DESC`

const 线下指标美团关店次数 = (id, d = 7) => `SELECT
    count( msgTitle = '已被置休' OR NULL ) off_count,
    DATE_FORMAT(insert_date, '%Y-%m-%d') date
    FROM
    foxx_sys_message 
    WHERE 
    wmpoiid = ${id} AND 
    insert_date > DATE_SUB( CURRENT_DATE, INTERVAL ${d - 1} DAY )
    GROUP BY DATE_FORMAT( insert_date, '%Y%m%d' )
    ORDER BY insert_date DESC`

const elm_shop_acts_diff = `SELECT t.shop_id, e.shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.real_shop_name, r.person, r.leader,
    title, rule, date, insert_date
    FROM
    (
    SELECT t1.shop_id, t1.title, t1.rule, t1.date, t1.insert_date
    FROM ele_activity_full_reduction t1 -- 今天
    WHERE insert_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 1 DAY) AND descs = '进行中' AND conflict_message IS NULL 
    UNION ALL
    SELECT t2.shop_id, t2.title, t2.rule, t2.date, t2.insert_date
    FROM ele_activity_full_reduction t2 -- 昨天
    WHERE insert_date BETWEEN DATE_SUB(CURDATE(),INTERVAL 1 DAY) AND CURDATE() AND descs = '进行中' AND conflict_message IS NULL
    )  t
    LEFT JOIN ele_info_manage e USING(shop_id)
    LEFT JOIN test_shop_ r USING(shop_id)
    GROUP BY t.shop_id, title, rule
    HAVING COUNT(*) = 1
    ORDER BY t.shop_id, title, insert_date`

const mt_shop_acts_diff = `SELECT t.wmpoiid shop_id, m.reptile_type shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.real_shop_name, r.person, r.leader,
    name title, detail rule, CONCAT(DATE_FORMAT(start_time,'%Y%m%d'),' 至 ', DATE_FORMAT(end_time,'%Y%m%d')) date, DATE_FORMAT(date,'%Y-%m-%d') insert_date
    FROM
    (
    SELECT t1.wmpoiid, t1.name, t1.detail, t1.start_time, t1.end_time, t1.date
    FROM foxx_market_activit_my t1 -- 今天
    WHERE date = CURDATE() AND status_desc = '进行中'
    UNION ALL
    SELECT t2.wmpoiid, t2.name, t2.detail, t2.start_time, t2.end_time, t2.date
    FROM foxx_market_activit_my t2 -- 昨天
    WHERE date = DATE_SUB(CURDATE(),INTERVAL 1 DAY) AND status_desc = '进行中'
    )  t
    LEFT JOIN foxx_shop_reptile m USING(wmpoiid)
    LEFT JOIN test_shop_ r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, name, detail
    HAVING COUNT(*) = 1
    ORDER BY t.wmpoiid, name, date`

const mt_spareas_diff = `SELECT t.wmpoiid shop_id, m.reptile_type shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.real_shop_name, r.person, r.leader,
    '配送范围' title, longitude, latitude, logisticsAreas, minPrice, shippingFee, '-' date, insert_date
    FROM
    (
    SELECT t1.wmpoiid, t1.longitude, t1.latitude, t1.logisticsAreas, t1.minPrice, t1.shippingFee, t1.insert_date
    FROM foxx_spareas_info t1 -- 今天
    WHERE insert_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 1 DAY) 
    UNION ALL
    SELECT t2.wmpoiid, t2.longitude, t2.latitude, t2.logisticsAreas, t2.minPrice, t2.shippingFee, t2.insert_date
    FROM foxx_spareas_info t2 -- 昨天
    WHERE insert_date BETWEEN DATE_SUB(CURDATE(),INTERVAL 1 DAY) AND CURDATE()
    )  t
    LEFT JOIN foxx_shop_reptile m USING(wmpoiid)
    LEFT JOIN test_shop_ r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, longitude, latitude, logisticsAreas, minPrice, shippingFee
    HAVING COUNT(*) = 1
    ORDER BY t.wmpoiid, longitude, latitude, insert_date`

const elm_spareas_diff = `SELECT t.shop_id, e.shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.real_shop_name, r.person, r.leader,
    '配送范围' title, shop_product_desc, price_items, delivery_fee_items, '-' date,  insert_date
    FROM
    (
    SELECT t1.shop_id, t1.shop_product_desc, t1.price_items, t1.delivery_fee_items, t1.insert_date
    FROM ele_delivery_fee t1 -- 今天
    WHERE insert_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 1 DAY) 
    UNION ALL
    SELECT t2.shop_id, t2.shop_product_desc, t2.price_items, t2.delivery_fee_items, t2.insert_date
    FROM ele_delivery_fee t2 -- 昨天
    WHERE insert_date BETWEEN DATE_SUB(CURDATE(),INTERVAL 1 DAY) AND CURDATE()
    )  t
    LEFT JOIN ele_info_manage e USING(shop_id)
    LEFT JOIN test_shop_ r USING(shop_id)
    GROUP BY t.shop_id, shop_product_desc, price_items, delivery_fee_items
    HAVING COUNT(*) = 1
    ORDER BY t.shop_id, shop_product_desc, insert_date`

const elm_foods_diff = `SELECT t.shop_id, e.shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.real_shop_name, r.person, r.leader,
    '商品详情' title, category_name, global_id, name, activity_price, price, package_fee, min_purchase_quantity, on_shelf, '-' date,  insert_date
    FROM
    (
    SELECT t1.shop_id, t1.category_name, t1.global_id, t1.name, t1.activity_price, t1.price, t1.package_fee, t1.min_purchase_quantity, t1.on_shelf, t1.insert_date
    FROM ele_food_manage t1 -- 今天
    WHERE insert_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 1 DAY) 
    UNION ALL
    SELECT t2.shop_id, t2.category_name, t2.global_id, t2.name, t2.activity_price, t2.price, t2.package_fee, t2.min_purchase_quantity, t2.on_shelf, t2.insert_date
    FROM ele_food_manage t2 -- 昨天
    WHERE insert_date BETWEEN DATE_SUB(CURDATE(),INTERVAL 1 DAY) AND CURDATE()
    )  t
    LEFT JOIN ele_info_manage e USING(shop_id)
    LEFT JOIN test_shop_ r USING(shop_id)
    GROUP BY t.shop_id, global_id, activity_price, price, package_fee, min_purchase_quantity
    HAVING COUNT(*) = 1
    ORDER BY t.shop_id, global_id, insert_date`

const mt_foods_diff = `SELECT t.wmpoiid shop_id, m.reptile_type shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.real_shop_name, r.person, r.leader,
    '商品详情' title, tagName, productId, name, price, boxPrice, sellStatus, '-' date, DATE_FORMAT(date,'%Y-%m-%d') insert_date
    FROM
    (
    SELECT t1.wmpoiid, t1.tagName, t1.productId, t1.name, t1.price, t1.boxPrice, t1.sellStatus, t1.date
    FROM foxx_food_manage t1 -- 今天
    WHERE date = CURDATE()
    UNION ALL
    SELECT t2.wmpoiid, t2.tagName, t2.productId, t2.name, t2.price, t2.boxPrice, t2.sellStatus, t2.date
    FROM foxx_food_manage t2 -- 昨天
    WHERE date = DATE_SUB(CURDATE(),INTERVAL 1 DAY)
    )  t
    LEFT JOIN test_shop_ m USING(wmpoiid)
    LEFT JOIN foxx_real_shop_info r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, productId, price, boxPrice
    HAVING COUNT(*) = 1 
    ORDER BY t.wmpoiid, productId, insert_date`

const mt_discounts_diff = `SELECT t.wmpoiid shop_id, m.reptile_type shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.real_shop_name, r.person, r.leader,
    '折扣商品详情' title, itemName, actInfo, actPrice, orderLimit, manual_sorting, isTop, 
    CONCAT(FROM_UNIXTIME(startTime, '%Y%m%d'), ' 至 ', FROM_UNIXTIME(endTime, '%Y%m%d'))date, DATE_FORMAT(date,'%Y-%m-%d') insert_date
    FROM
    (
    SELECT t1.wmpoiid, t1.itemName, t1.actInfo, t1.actPrice, t1.orderLimit, t1.manual_sorting, t1.isTop, t1.start_Time, t1.endTime, t1.date
    FROM foxx_market_activit_my_discounts t1 -- 今天
    WHERE date = CURDATE()
    UNION ALL
    SELECT t2.wmpoiid, t2.itemName, t2.actInfo, t2.actPrice, t2.orderLimit, t2.manual_sorting, t2.isTop, t2.startTime, t2.endTime, t2.date
    FROM foxx_market_activit_my_discounts t2 -- 昨天
    WHERE date = DATE_SUB(CURDATE(),INTERVAL 1 DAY)
    )  t
    LEFT JOIN foxx_shop_reptile m USING(wmpoiid)
    LEFT JOIN test_shop_ r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, itemName, actPrice, orderLimit
    HAVING COUNT(*) = 1 
    ORDER BY t.wmpoiid, itemName, insert_date`

const mt_shop_cate_diff = `SELECT t.wmpoiid shop_id, wmpoiname shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.real_shop_name, r.person, r.leader,
    '店铺分类' title, mainCategory, supplementCategory, '-' date, insert_date
    FROM
    (
    SELECT t1.wmpoiid, t1.wmpoiname, t1.mainCategory, t1.supplementCategory, t1.insert_date
    FROM foxx_shop_category t1 -- 今天
    WHERE insert_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 1 DAY) 
    UNION ALL
    SELECT t2.wmpoiid, t2.wmpoiname, t2.mainCategory, t2.supplementCategory, t2.insert_date
    FROM foxx_shop_category t2 -- 昨天
    WHERE insert_date BETWEEN DATE_SUB(CURDATE(),INTERVAL 1 DAY) AND CURDATE()
    )  t
    LEFT JOIN test_shop_ r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, mainCategory, supplementCategory
    HAVING COUNT(*) = 1 
    ORDER BY t.wmpoiid, mainCategory, supplementCategory, insert_date`

const 原价扣点城市折扣与原价差距大于2 = ` -- 原价扣点城市折扣与原价差距大于2
  WITH
  a AS (
    -- 门店信息
    SELECT * FROM test_shop_
  ),
  b AS (
  --  查询饿了么原价扣点城市商品
    SELECT
      shop_id,
      name,
      price,
      activity_price,
      2 platform
    FROM ele_food_manage
    WHERE 
      insert_date > CURRENT_DATE AND
  -- 		筛选原价扣点城市的id
      shop_id IN (
        SELECT shop_id FROM foxx_real_shop_info WHERE platform = 2 AND is_original_price_deduction_point = 1 AND is_delete = 0
      )
  ),
  c AS (
  --  查询美团原价扣点城市商品
    SELECT 
      wmpoiid,
      itemName,
      actPrice,
      actInfo,
      1 platform
    FROM 
      foxx_market_activit_my_discounts 
    WHERE 
      date = CURRENT_DATE AND
      activity_state = '生效' AND
  -- -- 		筛选原价扣点城市的id
      wmpoiid IN (
        SELECT shop_id FROM foxx_real_shop_info WHERE platform = 1 AND is_original_price_deduction_point = 1 AND is_delete = 0
      )
  ),
  d AS (
  -- 合并美团饿了么数据
    SELECT * FROM b
    UNION ALL
    SELECT * FROM c
  )
  -- 联结门店信息
  SELECT
    a.shop_id 门店id,
    a.shop_name 门店,
    IF(a.platform IS NULL, NULL, IF(a.platform = 1, '美团', '饿了么')) 平台,
    a.real_shop_name 物理店,
    a.person 责任人,
    a.leader 组长,
    a.new_person 新店责任人,
    d.name 品名,
    d.price 原价,
    d.activity_price 折扣价
  FROM a JOIN d ON a.shop_id = d.shop_id
  WHERE 
    d.activity_price > 0 AND
    d.price - d.activity_price > 2;
  OERDER BY 物理店`

const 商品无餐盒费 = `WITH
  a AS (
    -- 门店信息
    SELECT * FROM test_shop_
  ),
  b AS (
  -- 饿了么无餐盒费
    SELECT
      shop_id,
      name,
      category_name,
      price,
      package_fee,
      min_purchase_quantity
    FROM ele_food_manage
    WHERE 
      insert_date > CURRENT_DATE AND
      package_fee = 0
  ),
  c AS (
  -- 	美团无餐盒费
    SELECT
      wmpoiid,
      name,
      tagName,
      price / 100 price,
      boxPrice,
      minOrderCount
    FROM foxx_food_manage
    WHERE
      date = CURRENT_DATE AND
      boxPrice = 0
  ),
  d AS (
    SELECT * FROM b
    UNION ALL
    SELECT * FROM c
  )
  SELECT
    a.shop_id,
    a.shop_name,
    IF(a.platform IS NULL, NULL, IF(a.platform = 1, '美团', '饿了么')) platform,
    a.real_shop_name,
    a.person,
    a.leader,
    a.new_person,
    d.name 品名,
    d.category_name 分类,
    d.price 原价,
    d.package_fee 餐盒费,
    d.min_purchase_quantity 起购数
  FROM a JOIN d ON a.shop_id = d.shop_id
  WHERE
    price BETWEEN 1 AND 30 AND
    d.category_name NOT LIKE '%福利%' AND
    d.category_name NOT LIKE '%料%' AND
    d.category_name NOT LIKE '%餐具%' AND
    d.category_name NOT LIKE '%先扫%' AND
    d.category_name NOT LIKE '%保温袋%' AND
    d.name NOT LIKE '%红包%' AND
    d.name NOT LIKE '%店铺升级%'
  ORDER BY real_shop_name`

const 美团薯饼虾饼鸡柳设置两份起购 = `SELECT
    food.wmpoiid 门店id,
    shop.reptile_type 店名,
    food.productId 餐品id,
    food.tagname 分类名,
    food.name 品名,
    food.sellCount 销量,
    food.minOrderCount 起购数,
    food.boxPrice 餐盒费,
    food.price/100 原价,
    act.actPrice 折扣价,
    act.orderLimit 每单折扣限购
    FROM
    (
    SELECT * from foxx_food_manage where 
    date = curdate()
    ) food
    LEFT JOIN  
    (
    SELECT * from foxx_market_activit_my_discounts where 
    date = curdate()
    ) act
    ON food.wmpoiid = act.wmpoiid and food.name = act.itemName
    join 
    (SELECT * from foxx_shop_reptile
    ) shop
    ON shop.wmpoiid = food.wmpoiid
    where  shop.deduction is null and act.actPrice < 5 and act.actPrice > 0 and food.minOrderCount < 2 and (food.name like '%薯饼%' or food.name like '%鸡柳%' or food.name like '%虾饼%' )
    ORDER BY shop.reptile_type,sellCount desc`

const 餐盒费为0常规餐品设置餐盒费1 = ` SELECT
    food.wmpoiid 门店id,
    shop.reptile_type 店名,
    food.productId 餐品id,
    food.tagname 分类名,
    food.name 品名,
    food.sellCount 销量,
    food.minOrderCount 起购数,
    food.boxPrice 餐盒费,
    food.price/100 原价,
    act.actPrice 折扣价,
    act.orderLimit 每单折扣限购
    FROM
    (
    SELECT * from foxx_food_manage where 
    date = curdate()
    ) food
    LEFT JOIN  
    (
    SELECT * from foxx_market_activit_my_discounts where 
    date = curdate()
    ) act
    ON food.wmpoiid = act.wmpoiid and food.name = act.itemName
    join 
    (SELECT * from foxx_shop_reptile
    ) shop
    ON shop.wmpoiid = food.wmpoiid

    WHERE 
    shop.reptile_type NOT LIKE '%大计划%' 
    AND shop.reptile_type NOT LIKE '%抚州%' 
    AND shop.reptile_type NOT LIKE '%炸鸡%' 
    AND food.boxPrice = 0 
    AND food.price / 100 <> 0 
    AND food.minOrderCount < 2
    AND food.NAME NOT LIKE '%加料%' 
    AND food.NAME NOT LIKE '%保温袋%' 
    AND food.NAME NOT LIKE '%码领%' 
    AND food.NAME NOT LIKE '%福利%' 
    AND food.NAME NOT LIKE '%美团会员%' 
    AND food.NAME NOT LIKE '%福袋%' 
    AND food.NAME NOT LIKE '%勿拍%' 
    AND food.tagname NOT LIKE '%放心%'
    ORDER BY shop.reptile_type,sellCount desc`

const _0_01两份起购餐盒费调整为1_5 = ` SELECT
    food.wmpoiid 门店id,
    shop.reptile_type 店名,
    food.productId 餐品id,
    food.tagname 分类名,
    food.name 品名,
    food.sellCount 销量,
    food.minOrderCount 起购数,
    food.boxPrice 餐盒费,
    food.price/100 原价,
    act.actPrice 折扣价,
    act.orderLimit 每单折扣限购
    FROM
    (
    SELECT * from foxx_food_manage where 
    date = curdate()
    ) food
    LEFT JOIN  
    (
    SELECT * from foxx_market_activit_my_discounts where 
    date = curdate()
    ) act
    ON food.wmpoiid = act.wmpoiid and food.name = act.itemName
    join 
    (SELECT * from foxx_shop_reptile
    ) shop
    ON shop.wmpoiid = food.wmpoiid

    WHERE act.actPrice = 0.01
    and food.boxPrice < 1.5
    and shop.reptile_type NOT LIKE '%大计划%' 
    and food.price/100 > 10
    ORDER BY shop.reptile_type,sellCount desc`

const 折扣餐品原价_餐盒费会起送 = ` SELECT
    food.wmpoiid 门店id,
    shop.reptile_type 店名,
    food.productId 餐品id,
    food.tagname 分类名,
    food.name 品名,
    food.sellCount 销量,
    food.minOrderCount 起购数,
    food.boxPrice 餐盒费,
    food.price/100 原价,
    act.actPrice 折扣价,
    act.orderLimit 每单折扣限购
    FROM
    (
    SELECT * from foxx_food_manage where 
    date = curdate()
    ) food
    LEFT JOIN  
    (
    SELECT * from foxx_market_activit_my_discounts where 
    date = curdate()
    ) act
    ON food.wmpoiid = act.wmpoiid and food.name = act.itemName
    join 
    (SELECT * from foxx_shop_reptile
    ) shop
    ON shop.wmpoiid = food.wmpoiid

    WHERE food.price/100 <20
    and (food.price/100 + food.boxPrice) > 15
    and food.minOrderCount = 1
    and act.actPrice is not null
    and act.actPrice < 14
    and food.name not like '%福袋%'
    ORDER BY shop.reptile_type,sellCount desc`

const 原价扣点城市产品原价与折扣价差距超过1_1 = ` SELECT
    food.wmpoiid 门店id,
    shop.reptile_type 店名,
    food.productId 餐品id,
    food.tagname 分类名,
    food.name 品名,
    food.sellCount 销量,
    food.minOrderCount 起购数,
    food.boxPrice 餐盒费,
    food.price/100 原价,
    act.actPrice 折扣价,
    act.orderLimit 每单折扣限购
    FROM
    (
    SELECT * from foxx_food_manage where 
    date = curdate()
    ) food
    LEFT JOIN  
    (
    SELECT * from foxx_market_activit_my_discounts where 
    date = curdate()
    ) act
    ON food.wmpoiid = act.wmpoiid and food.name = act.itemName
    join 
    (SELECT * from foxx_shop_reptile
    ) shop
    ON shop.wmpoiid = food.wmpoiid

    WHERE shop.deduction = 1
    and (food.price/100 - act.actPrice)>1.1

    ORDER BY shop.reptile_type,sellCount desc`

const _0元购有餐盒费 = `SELECT
    food.wmpoiid 门店id,
    shop.reptile_type 店名,
    food.productId 餐品id,
    food.tagname 分类名,
    food.name 品名,
    food.sellCount 销量,
    food.minOrderCount 起购数,
    food.boxPrice 餐盒费,
    food.price/100 原价,
    act.actPrice 折扣价,
    act.orderLimit 每单折扣限购
    FROM
    (
    SELECT * from foxx_food_manage where 
    date = curdate()
    ) food
    LEFT JOIN  
    (
    SELECT * from foxx_market_activit_my_discounts where 
    date = curdate()
    ) act
    ON food.wmpoiid = act.wmpoiid and food.name = act.itemName
    join 
    (SELECT * from foxx_shop_reptile
    ) shop
    ON shop.wmpoiid = food.wmpoiid

    WHERE shop.reptile_type not like '%大计划%' 
    and food.price/100 = 0
    and food.boxPrice > 0
    ORDER BY shop.reptile_type,sellCount desc`

const 加料门店 = `SELECT
    food.wmpoiid 门店id,
    shop.reptile_type 店名,
    food.productId 餐品id,
    food.tagname 分类名,
    food.name 品名,
    food.sellCount 销量,
    food.minOrderCount 起购数,
    food.boxPrice 餐盒费,
    food.price/100 原价,
    act.actPrice 折扣价,
    act.orderLimit 每单折扣限购
    FROM
    (
    SELECT * from foxx_food_manage where 
    date = curdate()
    ) food
    LEFT JOIN  
    (
    SELECT * from foxx_market_activit_my_discounts where 
    date = curdate()
    ) act
    ON food.wmpoiid = act.wmpoiid and food.name = act.itemName
    join 
    (SELECT * from foxx_shop_reptile
    ) shop
    ON shop.wmpoiid = food.wmpoiid

    WHERE shop.reptile_type not like '%大计划%' 
    and food.name like '%加料%'
    and shop.deduction = 1
    and act.actPrice is not null`

const 零元商品有餐盒费 = `-- 零元商品有餐盒费
  WITH
  a AS (
    -- 门店信息
    SELECT * FROM test_shop_
  ),
  b AS (
  -- 饿了么零元商品
    SELECT
      shop_id,
      name,
      category_name,
      price,
      package_fee,
      min_purchase_quantity
    FROM ele_food_manage
    WHERE 
      insert_date > CURRENT_DATE AND
      price = 0
  ),
  c AS (
  -- 	美团零元商品
    SELECT
      wmpoiid,
      name,
      tagName,
      price / 100 price,
      boxPrice,
      minOrderCount
    FROM foxx_food_manage
    WHERE
      date = CURRENT_DATE AND
      price = 0
  ),
  d AS (
    SELECT * FROM b
    UNION ALL
    SELECT * FROM c
  )
  SELECT
    a.shop_id,
    a.shop_name,
    IF(a.platform IS NULL, NULL, IF(a.platform = 1, '美团', '饿了么')) platform, 
    a.real_shop_name,
    a.person,
    a.leader,
    a.new_person,
    d.name 品名,
    d.category_name 分类,
    d.price 原价,
    d.package_fee 餐盒费,
    d.min_purchase_quantity 起购数
  FROM a JOIN d ON a.shop_id = d.shop_id
  WHERE
    package_fee > 0
  ORDER BY real_shop_name`

const 两份起购餐品价格错误 = `
    SET collation_connection = utf8mb4_general_ci;-- 设置参数

    SET @date = DATE_FORMAT( CURRENT_DATE, "%Y%m%d" );-- 输入日期

    -- 两份起购餐品价格错误
    WITH
    a AS (
      -- 门店信息
      SELECT * FROM test_shop_
    ),
    b AS (
    --  饿了么多份起购商品
    SELECT
      shop_id,
      name,
      category_name,
      price,
      package_fee,
      min_purchase_quantity,
      ( package_fee + price ) * min_purchase_quantity AS originalPrice
    FROM ele_food_manage
    WHERE 
    --  筛选出拆分卖的商品
      bach_date = @date AND
      min_purchase_quantity > 1 AND
      ( package_fee + price ) * min_purchase_quantity NOT BETWEEN 13.8 AND 15 AND
      price < 10
    ),
    c AS (
    -- 美团多份起购商品价格问题
    SELECT
      wmpoiid,
      name,
      tagName,
      price / 100 price,
      boxPrice,
      minOrderCount,
      ( boxPrice + price / 100 ) * minOrderCount originalPrice
    FROM foxx_food_manage
    WHERE
    --  筛选出拆分卖的商品
      date = @date AND
      minOrderCount > 1 AND
      ( boxPrice + price / 100 ) * minOrderCount NOT BETWEEN 13.8 AND 15 AND
      price < 1000
    ),
    d AS (
    SELECT * FROM b
    UNION ALL
    SELECT * FROM c
    )
    SELECT
    a.shop_id,
    a.shop_name,
    IF(a.platform IS NULL, NULL, IF(a.platform = 1, '美团', '饿了么')) platform,
    a.real_shop_name,
    a.person,
    a.new_person,
    name,
    category_name,
    price AS "商品原价",
    package_fee AS "餐盒费",
    min_purchase_quantity AS "起购量",
    originalPrice AS "凑满减/起送价格"
    FROM a JOIN d ON a.shop_id = d.shop_id
    ORDER BY real_shop_name`

const 津贴联盟 = `WITH
    a AS (
      SELECT
        wmpoiid, 
        count(date) 订单数, 
        SUM(settleAmount) 实收,
        SUM(lm_fee) 联盟津贴, 
        SUM(jp_fee) 减配送费,
        SUM(sjdj_fee) 商家代金券,
        SUM(zf_fee) 支付红包,
        SUM(xk_fee) 新客立减,
        SUM(hb_fee) 会员红包 
      FROM foxx_order_manag_historical
      WHERE date = CURRENT_DATE
      GROUP BY wmpoiid,date 
      HAVING SUM(zf_fee)>0 
      ORDER BY SUM(zf_fee) DESC
    ),
    b AS (
        -- 门店信息
      SELECT * FROM test_shop_
    )
    SELECT
      b.shop_id,
      b.shop_name,
      IF(b.platform IS NULL, NULL, IF(b.platform = 1, '美团', '饿了么')) platform, 
      b.real_shop_name,
      b.person,
      b.leader,
      b.new_person,
      订单数, 
      实收,
      联盟津贴, 
      减配送费,
      商家代金券,
      支付红包,
      新客立减,
      会员红包 
  FROM a JOIN b ON a.wmpoiid = b.shop_id
  ORDER BY real_shop_name`

const 饿了么所有门店配送费批量检查 = `-- 饿了么所有门店配送费批量检查
    WITH a AS (
    SELECT
      shop_id,
      rule,
      conflict_message,
      descs,
      date 
    FROM
      ele_activity_full_reduction 
    WHERE
      title LIKE "%减配送费%" 
      AND insert_date > CURRENT_DATE 
      AND descs = '进行中'
      AND ( conflict_message <> "已暂停" OR ISNULL( conflict_message ) ) 
    ),
    b AS ( SELECT shop_id, shop_name FROM ele_info_manage WHERE status = 0 ),
    c AS (
    SELECT
      b.*,
      a.rule,
      a.conflict_message,
      a.date 
    FROM
      a
      RIGHT JOIN b ON a.shop_id = b.shop_id 
    ),
    d AS (
    SELECT
      shop_id,
      shop_product_desc,
      price_items,
      delivery_fee_items 
    FROM
      ele_delivery_fee 
    WHERE
      CURDATE() < insert_date 
      AND shop_product_desc IN ( '蜂鸟快送', '蜂鸟众包', '蜂鸟专送', '自配送', 'e配送' ) 
    ) 
    SELECT
    c.shop_id 店铺id,
    c.shop_name 店铺名称,
    d.shop_product_desc 配送方式,
    c.conflict_message 活动状态,
    c.rule 活动规则,
    d.delivery_fee_items 配送费,
    d.price_items 起送价,
    c.date 活动时间 
    FROM
    c
    LEFT JOIN d ON c.shop_id = d.shop_id 
    WHERE rule LIKE  "%（%"
    ORDER BY
    d.delivery_fee_items`

const 原价扣点城市折扣与原价差距大1 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a
    JOIN b ON a.shop_id = b.shop_id
    where a.deduction = 1 
    and b.activity_price > 0 
    and b.max_price - b.activity_price > 1`

const 饿了么无餐盒费_1 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a
    JOIN b ON a.shop_id = b.shop_id
    where b.package_fee = 0 
    and b.min_purchase_quantity= 1
    and b.category_name not like '%福利%' 
    and b.category_name not like '%加料%' 
    and b.category_name not like '%餐具%'
    and b.category_name not like '%先扫%'
    and b.category_name not like '%保温袋%'
    and b.name not like '%红包%'
    and b.name not like '%店铺升级%'`

const 饿了么两份起购无餐盒费_0_5 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a
    JOIN b ON a.shop_id = b.shop_id
    where b.package_fee = 0 
    and b.min_purchase_quantity= 2
    and b.max_price < 8
    and b.category_name not like '%福利%' 
    and b.category_name not like '%加料%' 
    and b.category_name not like '%餐具%'
    and b.category_name not like '%先扫%'
    and b.category_name not like '%保温袋%'`

const 饿了么_0_01两份起购餐盒费调整为1_5 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a
    JOIN b ON a.shop_id = b.shop_id
    where a.shop_name not like '%甜品%' 
    and b.min_purchase_quantity = 2 
    and b.activity_price = 0.01 
    and b.package_fee < 1.5 `

const 饿了么贡茶粉面套餐价格错误 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a JOIN b ON a.shop_id = b.shop_id
    where a.deduction is null
    and a.shop_name not like '%甜品%'
    and (b.name like '%车仔面+牛筋丸%'
    or b.name like '%乌冬面+牛筋丸%'
    or b.name like '%酸辣粉+牛筋丸%'
    or b.name like '%乌冬面+咖喱鱼丸%'
    or b.name like '%酸辣粉+咖喱鱼丸%'
    or b.name like '%车仔面+咖喱鱼丸%'
    or b.name like '%酸辣粉+火山石烤肉肠%'
    or b.name like '%车仔面+火山石烤纯肉肠%'
    or b.name like '%乌冬面+火山石烤纯肉肠%')
    and ( b.price < 24 or b.activity_price < 14 )`

const 饿了么甜品粉面套餐价格错误 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a JOIN b ON a.shop_id = b.shop_id
    where a.deduction is null
    and a.shop_name  like '%甜品%'
    and (b.name like '%车仔面+牛筋丸%'
    or b.name like '%乌冬面+牛筋丸%'
    or b.name like '%酸辣粉+牛筋丸%'
    or b.name like '%乌冬面+咖喱鱼丸%'
    or b.name like '%酸辣粉+咖喱鱼丸%'
    or b.name like '%车仔面+咖喱鱼丸%'
    or b.name like '%酸辣粉+火山石烤肉肠%'
    or b.name like '%车仔面+火山石烤纯肉肠%'
    or b.name like '%乌冬面+火山石烤纯肉肠%')
    and ( b.price < 24 or b.activity_price < 14 )`

const 饿了么折扣餐品原价_餐盒费会起送 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a
    JOIN b ON a.shop_id = b.shop_id
    where b.activity_price > 0 
    and max_price < 15
    and b.price + b.package_fee > 15
    and b.min_purchase_quantity = 1`

const 饿了么低折扣商品起购错误 = `
    WITH
    a AS (
    -- 1份起购产品低价产品
      SELECT
        shop_id,
        category_name,
        name,
        activity_price,
        min_purchase_quantity
      FROM ele_food_manage 
      WHERE min_purchase_quantity = 1
      AND activity_price BETWEEN 0.01 AND 2
      AND DATE_FORMAT( CURRENT_DATE, "%Y%m%d") = bach_date
    ),
    b AS (
      SELECT
        wmpoiid,
        itemName,
        actPrice
      FROM foxx_market_activit_my_discounts 
      WHERE 
      CURRENT_DATE = date
    -- 低于多少元没有设置起购
      AND actPrice < 2
      AND itemName NOT LIKE '%加料%'
      AND itemName NOT LIKE '%豆沙%'
      AND activity_state = '生效'
    ),
    c AS (
      SELECT 
        wmpoiid,
        name,
        tagName,
        minOrderCount
      FROM foxx_food_manage 
      WHERE minOrderCount < 2
      AND CURRENT_DATE = date
    ),
    d AS (
      SELECT
        c.wmpoiid,
        c.tagName,
        c.name,
        actPrice,
        c.minOrderCount
      FROM c JOIN b ON c.wmpoiid = b.wmpoiid AND b.itemName = c.name
      UNION ALL
      SELECT * FROM a
    ),
    e AS (
      -- 门店信息
      SELECT * FROM test_shop_
    )
    SELECT
      d.wmpoiid 店铺id,
      e.person 责任人,
      e.leader 组长,
      e.new_person 新店责任人,
      e.real_shop_name 物理店,
      IF(e.platform IS NULL, NULL, IF(e.platform = 1, '美团', '饿了么')) 平台,
      e.shop_name 店名,
      tagName 分类,
      name 商品,
      actPrice 折扣价,
      minOrderCount AS '起购数量'
    FROM 
      d JOIN e ON d.wmpoiid = e.shop_id
    ORDER BY 物理店`

const 饿了么低折扣商品限购数量错误 = `-- 美团
    WITH
    a AS (
    -- 低折扣价商品
      SELECT
        wmpoiid,
        itemName,
        actInfo,
        actPrice,
        orderLimit
      FROM foxx_market_activit_my_discounts 
      WHERE 
        date = DATE_FORMAT( CURRENT_DATE, "%Y%m%d" )
        AND actPrice < 2
        AND itemName NOT LIKE '%鸡爪%'
        AND itemName NOT LIKE '%小丸子%'
        AND itemName NOT LIKE '%臭豆腐%'
        AND itemName NOT LIKE '%提拉米苏%'
        AND itemName NOT LIKE '%加料%'
        AND itemName NOT LIKE '%豆沙%'
        AND itemName NOT LIKE '%椰汁糕%'
        AND itemName NOT LIKE '%白白胖胖%'
      AND activity_state = '生效'
      AND orderLimit <> 1
    ),
    b AS (
      -- 低折扣价商品
      SELECT 
        shop_id,
        food_name,
        activi_origin_price,
        activi_price,
        effect_times
      FROM ele_food_activi_detai 
      WHERE 
        CURRENT_DATE < insert_date 
        AND activi_price < 2
        AND effect_times > 1
        AND activi_status = "进行中"
        AND food_name NOT LIKE '%鸡爪%'
        AND food_name NOT LIKE '%小丸子%'
        AND food_name NOT LIKE '%臭豆腐%'
        AND food_name NOT LIKE '%魔方%'
        AND food_name NOT LIKE '%加%'
        AND food_name NOT LIKE '%保温袋%'
        AND food_name NOT LIKE '%豆沙%'
    ),
    c AS (
      SELECT
        x.shop_id,
        x1.shop_name,
        y.shop_address,
        y.real_shop_name,
        z.nick_name person,
        CASE
        WHEN x.platform = 1 THEN "美团"
        ELSE "饿了么"
        END platform
      FROM
        platform_shops x
        JOIN base_physical_shops y ON x.physical_id = y.id AND x.is_delete = 0 AND y.is_delete = 0
        JOIN sys_user z ON y.user_id = z.user_id
        JOIN (
          SELECT shop_id,shop_name FROM ele_info_manage WHERE status = 0
          UNION ALL
          SELECT wmpoiid, reptile_type FROM foxx_shop_reptile WHERE status = 0
        ) x1 ON x1.shop_id = x.shop_id
        WHERE project = 0
    ),
    d AS (
      SELECT 
        a.wmpoiid,
        a.itemName,
        actInfo,
        actPrice,
        orderLimit
      FROM a 
      UNION ALL
      SELECT * FROM b
    )
    SELECT c.*,d.itemName, d.actInfo, d.actPrice, d.orderLimit FROM d JOIN c ON d.wmpoiid = c.shop_id
    ORDER BY real_shop_name`

const 零元购有餐盒费 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a
    JOIN b ON a.shop_id = b.shop_id

    where b.max_price = 0
    and b.package_fee > 0`

const 饿了么两份起购餐品价格错误 = `WITH
    a AS (
    --  表一
    SELECT * FROM ele_info_manage
    ),
    b AS (
    --  表二
    SELECT * FROM ele_food_manage WHERE insert_date > CURRENT_DATE

    )
    SELECT
    a.shop_name 门店,
    b.shop_id 门店id,
    b.name 品名,
    b.category_name 分类,
    b.max_price 原价,
    b.activity_price 折扣价,
    b.package_fee 餐盒费,
    b.min_purchase_quantity 起购数,
    b.recent_sales 销量,
    b.on_shelf 上下架状态
    FROM 
    a
    JOIN b ON a.shop_id = b.shop_id
    where a.deduction is null
    and (b.name like '%薯饼%' or b.name like '%鸡柳%' or b.name like'%虾饼%' or b.name like '%肉肠%' or b.name like '%翅根%')
    and b.min_purchase_quantity = 2
    and ( b.package_fee + b.max_price ) < 7.2 and ( b.package_fee + b.max_price ) < 7.4 `

const 单折扣起送 = `WITH
    a AS (
    -- 饿了么起送价格
      SELECT 
        shop_id,
        price_items
      FROM 
        ele_delivery_fee
      WHERE	
        CURRENT_DATE < insert_date AND
        shop_product_desc IN ('自配送','蜂鸟众包','蜂鸟快送','蜂鸟专送','e基础') AND
        price_items > 10
    ),
    b AS (
    -- 饿了么折扣商品
      SELECT
        shop_id,
        name,
        category_name,
        price,
        package_fee,
        activity_price,
        min_purchase_quantity,
        ROUND(( price + package_fee ) * min_purchase_quantity, 2 ) originalPrice
      FROM 
        ele_food_manage
      WHERE 
        bach_date = DATE_FORMAT( CURRENT_DATE, "%Y%m%d")
        AND activity_price > 0
        AND category_name NOT LIKE '%粉面%'
        AND category_name NOT LIKE '%套餐%'
        AND name NOT LIKE '%雪媚娘%'
        AND name NOT LIKE '%椰子冻%'
    ),
    c AS (
    -- 饿了么起送商品
      SELECT
        b.shop_id,
        a.price_items,
        b.category_name,
        b.name,
        b.price,
        b.activity_price,
        b.package_fee,
        originalPrice
      FROM b JOIN a ON b.shop_id = a.shop_id
      AND b.originalPrice > a.price_items
    ),
    d AS (
    -- 美团起送价
      SELECT
        wmpoiid,
        minPrice
      FROM
        foxx_spareas_info 
      WHERE
        insert_date > CURRENT_DATE AND
        minPrice > 10
    ),
    e1 AS (
    -- 美团商品
      SELECT
        wmpoiid,
        name,
        tagName,
        price / 100 AS price,
        boxPrice,
        minOrderCount
      FROM
        foxx_food_manage 
      WHERE
        date = CURRENT_DATE 
    ),
    e2 AS (
    -- 美团折扣
      SELECT 
        wmpoiid,
        actPrice,
        itemName
      FROM foxx_market_activit_my_discounts 
      WHERE 
        date = CURRENT_DATE AND
        activity_state = '生效' AND
        actPrice > 1
    ),
    e AS (
    -- 折扣商品
      SELECT
        e1.wmpoiid,
        name,
        tagName,
        price,
        actPrice,
        boxPrice,
        GREATEST( minOrderCount, 1 ) minOrderCount
      FROM 
        e1 LEFT JOIN e2 
        ON e1.wmpoiid = e2.wmpoiid
        AND e1.name = e2.itemName
      WHERE NOT ISNULL(actPrice)
    ),
    f AS (
    -- 美团起送的商品
      SELECT 
        e.wmpoiid,
        d.minPrice,
        e.tagName,
        e.name,
        e.price,
        e.actPrice,
        e.boxPrice,
        e.minOrderCount * (e.price + e.boxPrice) originalPrice
      FROM
        e JOIN d ON e.wmpoiid = d.wmpoiid
      WHERE
          -- 	对商品的筛选
        tagName NOT LIKE '%粉面%' AND
        tagName NOT LIKE '%套餐%' AND
        e.name NOT LIKE '%雪媚娘%' AND
        e.name NOT LIKE '%椰子冻%' AND
        e.name NOT LIKE '%福袋%' AND
        e.minOrderCount * (e.price + e.boxPrice) > minPrice
    ),
    g AS (
      SELECT * FROM c
      UNION ALL
      SELECT * FROM f
    ),
    h AS (
        -- 门店信息
      SELECT * FROM test_shop_
    )
    SELECT
    h.shop_id,
    h.shop_name,
    IF(h.platform IS NULL, NULL, IF(h.platform = 1, '美团', '饿了么')) platform, 
    h.real_shop_name,
    h.person,
    h.leader,
    h.new_person,
    g.price_items,
    g.category_name,
    g.name,
    g.price,
    g.activity_price,
    g.package_fee,
    g.originalPrice
    FROM g JOIN h ON g.shop_id = h.shop_id
    ORDER BY real_shop_name`

const 成本表查漏 = `WITH
    a AS (
      SELECT wmpoiid, name, tagName, productId FROM foxx_food_manage WHERE date = CURRENT_DATE AND sellStatus = 0
      UNION ALL
      SELECT shop_id, name, category_name, global_id FROM ele_food_manage WHERE bach_date = DATE_FORMAT(CURRENT_DATE, "%Y%m%d") AND on_shelf = "上架"
    ),
    b AS (
      SELECT food_platform_id, food_id FROM food_id_info
    ),
    c AS (
        -- 门店信息
      SELECT
        shop_id,
        F_GET_SHOP_NAME(shop_id) shop_name,
        CASE platform
          WHEN 1 THEN '美团'
          ELSE '饿了么'
        END platform,
        person,
        real_shop_name
      FROM foxx_real_shop_info
      WHERE 
        is_delete = 0
        AND real_shop_name <> "花果园"
    )
    SELECT
      a.wmpoiid 店铺id,
      shop_name 店名,
      real_shop_name 物理店,
      platform 平台,
      person 责任人,
      a.tagName 商品分类,
      a.name 商品名称,
      a.productId 商品spu码
    FROM
      a
      LEFT JOIN b ON a.productId = b.food_platform_id
      JOIN c ON a.wmpoiid = c.shop_id 
    WHERE
      food_id IS NULL 
    ORDER BY 物理店`

const 查询点金0曝光的时间 = `-- 查询点金0曝光的时间，可能是达到预算、没钱等原因
  WITH
  a AS (
  -- 点进曝光数量为0的时间点
    SELECT 
      wmpoiid,
      MIN(periodTime) OVER(PARTITION BY wmpoiid) endTime
    FROM 
      foxx_period_time_gold
    WHERE 
      DATE_ADD(date,INTERVAL 1 DAY) = CURRENT_DATE
      AND periodTime > 10
      AND showCount = 0
    GROUP BY wmpoiid
  ),
  b AS (
    -- 门店信息
    SELECT * FROM test_shop_
  )
  SELECT
    b.shop_id,
    b.shop_name,
    IF(b.platform IS NULL, NULL, IF(b.platform = 1, '美团', '饿了么')) platform, 
    b.real_shop_name,
    b.person,
    b.leader,
    b.new_person,
    endTime AS "点金0曝光时间"
  FROM
    a
    JOIN b ON a.wmpoiid = b.shop_id
  ORDER BY 
    person,
    endTime`

const 美团配送范围对比昨日 = `WITH
    a AS (
      SELECT * FROM ( 
        SELECT 
          wmpoiid,
          logisticsAreas - LEAD(logisticsAreas,1) OVER(
            PARTITION BY wmpoiid 
            ORDER BY insert_date DESC
          ) AS chg
        FROM foxx_spareas_info 
        WHERE insert_date > DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)
      ) chg
    ),
    b AS (
        -- 门店信息
      SELECT
        shop_id,
        F_GET_SHOP_NAME(shop_id) shop_name,
        CASE platform
          WHEN 1 THEN '美团'
          ELSE '饿了么'
        END platform,
        person,
        real_shop_name
      FROM foxx_real_shop_info
      WHERE 
        platform = 1 AND
        is_delete = 0
    )
    SELECT 
      b.*,
      a.chg
    FROM a JOIN b ON a.wmpoiid = b.shop_id
    WHERE chg <> 0
    ORDER BY real_shop_name`

const 检查折扣遗漏的商品 = `WITH 
    a AS(
    --  饿了么应该上折扣的商品列表
      SELECT
        shop_id, 
        specs_global_id,
        name,
        category_name,
        price
      FROM ele_food_manage
      WHERE 
        insert_date > CURRENT_DATE AND 
        category_name LIKE '%折扣%'
    ),
    b AS (
    --  饿了么已经上了折扣的商品列表
      SELECT
        shop_id, 
        food_id
      FROM ele_food_activi_detai 
      WHERE
        insert_date > CURRENT_DATE AND 
        activi_status IN ('进行中','3天后结束','2天后结束','今天结束') 
    ),
    c AS (
    -- 匹配饿了么没上折扣的商品
      SELECT a.shop_id, name, category_name, price FROM a LEFT JOIN b ON a.shop_id = b.shop_id AND a.specs_global_id = b.food_id WHERE b.food_id IS NULL
    ),
    d AS(
    --  美团应该上折扣的商品列表
      SELECT 
        wmpoiid,
        name,
        tagName,
        price/100 AS price
      FROM
        foxx_food_manage 
      WHERE 
        date = CURRENT_DATE AND
    --  解馋小吃没有折扣商品
        tagName LIKE '%折扣%'
    ),
    e AS (
    --  美团已经上了折扣的商品列表
      SELECT 
        wmpoiid, 
        itemName 		
      FROM 
        foxx_market_activit_my_discounts 
      WHERE 
        date = CURRENT_DATE AND
        activity_state = '生效'
    ),
    f AS (
    --  美团折扣遗漏商品列表。通过名称链接的此表可能会出现一点问题
      SELECT 
        d.wmpoiid,
        d.name, 
        d.tagName, 
        d.price
      FROM 
        d LEFT JOIN e 
          ON d.wmpoiid = e.wmpoiid 
          AND d.name = e.itemName 
      WHERE ISNULL(e.itemName)
    ),
    g AS (
      SELECT * FROM c
      UNION ALL
      SELECT * FROM f
    ),
    h AS (
      -- 门店信息
      SELECT * FROM test_shop_
    )
    -- 匹配门店信息
    SELECT
      h.shop_id,
      h.shop_name,
      IF(h.platform IS NULL, NULL, IF(h.platform = 1, '美团', '饿了么')) platform, 
      h.real_shop_name,
      h.person,
      h.leader,
      h.new_person,
      g.name,
      g.category_name,
      g.price
    FROM g JOIN h                                                                             
    ON g.shop_id = h.shop_id
    ORDER BY real_shop_name`

const 折扣到期商品检查 = `-- 饿了么折扣到期商品检查
    WITH
    a AS (
      SELECT
        shop_id,
        food_name,
        activi_price,
        effect_times,
        activi_status
      FROM ele_food_activi_detai
      WHERE 
        CURRENT_DATE < insert_date AND
        activi_tags <> '超值换购' AND
    --  三天内结束
        (
          activi_status LIKE '%后结束%'
          OR activi_status LIKE '%天结束%'
        )	
    ),
    b AS (
      SELECT 
        wmpoiid,
        itemName,
        actPrice,
        orderLimit,
        SUBSTR(start_date FROM 10)
      FROM foxx_market_activit_my_discounts a 
      WHERE
        CURRENT_DATE = date
      -- 三天内结束
        AND activity_state = '生效'
        AND SUBSTR(start_date FROM 10) < DATE_FORMAT(DATE_add(CURRENT_DATE,INTERVAL 3 DAY),"%Y%m%d")
    ),
    c AS (
      SELECT * FROM a
      UNION ALL
      SELECT * FROM b
    ),
    d AS (
        -- 门店信息
      SELECT * FROM test_shop_
    )
    SELECT
      d.shop_id,
      d.shop_name,
      IF(d.platform IS NULL, NULL, IF(d.platform = 1, '美团', '饿了么')) platform,
      d.real_shop_name,
      d.person,
      d.leader,
      d.new_person,
      food_name,
      activi_price,
      activi_status
    FROM c JOIN d                                                                      
    ON c.shop_id = d.shop_id
    ORDER BY real_shop_name, food_name`

const 减配活动检查 = `SET @date = CURRENT_DATE;
	
WITH
a AS (-- 减配活动信息
  SELECT
    shop_id,
    period,
    is_auto_extend,
    start_distance,
    end_distance,
    discount,
    poi_charge,
    platform_charge,
    application,
    end_date
  FROM
    ele_activity_jp_history 
  WHERE
    date = DATE_FORMAT( @date, "%Y%m%d" )
    AND descs <> "已结束"
    AND descs <> "已作废"
    AND descs <> "待生效"
    AND conflict_message IS NULL
),
b AS (-- 配送信息
    SELECT
    shop_id,
    shop_product_desc,
    price_items,
    delivery_fee_items
  FROM
    ele_delivery_fee
  WHERE
    DATE_FORMAT( insert_date, "%Y-%m-%d" ) = @date AND
    shop_product_desc IN ( '蜂鸟快送', '蜂鸟众包', '蜂鸟专送', '自配送', 'e配送', '混合送' )
  UNION ALL
  SELECT
    wmpoiid,
    quickly_send,
    minPrice,
    shippingFee
  FROM foxx_spareas_info x JOIN
  (SELECT shop_id, quickly_send FROM foxx_delivery_cost WHERE date > @date AND quickly_send <> '美团全城送') y
  ON x.wmpoiid = y.shop_id
  WHERE insert_date >= @date
),
c AS (
	SELECT
		b.shop_id,
		period,
		end_date,
		price_items,
		delivery_fee_items,
		discount,
		poi_charge,	
		platform_charge,
		application,
		shop_product_desc,
		"即将结束" problems
	FROM
		a
		JOIN b ON a.shop_id = b.shop_id 
	WHERE
		end_date <= DATE_ADD( CURRENT_DATE, INTERVAL 3 DAY ) 
		AND is_auto_extend = 0
),
d AS (
	SELECT
		b.shop_id,
		period,
		end_date,
		price_items,
		delivery_fee_items,
		discount,
		poi_charge,	
		platform_charge,
		application,
		shop_product_desc,
		"减配活动与配送方式不适配" problems
	FROM
		a
		JOIN b ON a.shop_id = b.shop_id 
	WHERE
		application NOT LIKE "%全部%"
		AND application <> "未获取标品信息"
		AND application NOT LIKE CONCAT("%", shop_product_desc, "%")
		AND shop_product_desc <> "混合送"
),
e AS (
	SELECT
		b.shop_id,
		period,
		end_date,
		price_items,
		delivery_fee_items,
		discount,
		poi_charge,	
		platform_charge,
		application,
		shop_product_desc,
		"减配小于基础配送费" problems
	FROM
		a
		JOIN b ON a.shop_id = b.shop_id 
	WHERE
		discount < delivery_fee_items
),
f AS (
	SELECT 
		b.shop_id,
		period,
		end_date,
		price_items,
		delivery_fee_items,
		discount,
		poi_charge,	
		platform_charge,
		application,
		shop_product_desc,
		"没有减配活动" problems
	FROM
		a
		RIGHT JOIN b ON a.shop_id = b.shop_id
	WHERE period IS NULL
),
g AS (-- 整合减配问题
	SELECT * FROM c
	UNION ALL
	SELECT * FROM d
	UNION ALL
	SELECT * FROM e
	UNION ALL
	SELECT * FROM f
),
h AS (
	SELECT * FROM test_shop_
)
SELECT
	g.shop_id "门店编号",
	shop_name "店铺",
	IF(platform=1, '美团', '饿了么') "平台",
	person "组员",
  leader "组长",
	g.period "生效时段",
	end_date "到期时间",
	price_items "起送价",
	delivery_fee_items "基础配送",
	discount "实际减配",
	poi_charge "商家出资",
	platform_charge "平台出资",
	application "适配标品",
	shop_product_desc "配送方式",
	problems "问题"
FROM g JOIN h ON g.shop_id = h.shop_id`

const 假减配检查 = `WITH
    a AS (
    SELECT 
      shop_id,
      shop_name,
      order_id,
      active_time
    FROM ele_order_manag
    WHERE insert_date > CURRENT_DATE
      AND shop_id NOT IN ("2042678427","500795650","500795963")
    ),
    b AS (
    SELECT
      order_id,
      delivery_fee_business,
      delivery_fee_user
    FROM ele_order_manag_add
    WHERE insert_date > CURRENT_DATE
    ),
    c AS (
    SELECT 
      a.shop_id,
      b.*
    FROM a JOIN b ON a.order_id = b.order_id
    WHERE delivery_fee_business = 0
    AND delivery_fee_user > 0
    ),
    d AS (
    SELECT * FROM c GROUP BY shop_id
    ),
    e AS (
    SELECT shop_id,shop_name FROM ele_info_manage WHERE status = 0
    ),
    f AS (
    SELECT
      shop_id,
      packName
    FROM ele_packs_contract_service 
    WHERE insert_date > CURRENT_DATE
    )
    SELECT 
    d.shop_id,
    e.shop_name,
    packName,
    d.order_id AS '示例单号',
    d.delivery_fee_user AS '用户支付配送费',
    d.delivery_fee_business AS '商家支付配送费'
    FROM d JOIN e ON d.shop_id = e.shop_id
    JOIN f ON d.shop_id = f.shop_id`

const 满减活动检查 = `-- 满减：
    WITH 
    a AS (--  查询满减活动
    SELECT
      shop_id,
      title,
      rule,
      STR_TO_DATE( MID( date, LOCATE( "至", date ) + 2, 10 ), "%Y-%m-%d" ) end_time -- 获取结束日期
    FROM
      ele_activity_full_reduction
    WHERE
      DATE_FORMAT( insert_date, '%Y-%m-%d' ) = CURRENT_DATE AND
      title IN ( "店铺满减", "智能满减", "百亿补贴" ) AND
      ISNULL( conflict_message ) AND 
      ( descs = '进行中' OR descs LIKE '%天后结束%' OR descs LIKE '%天结束%' )
    ),
    b AS (
    SELECT
      wmpoiid,
      '店铺满减' title,
      detail,
      STR_TO_DATE( MID( start_time, LOCATE( "-", start_time ) + 1 ), "%Y%m%d" ) end_time -- 获取结束日期
    FROM  foxx_market_activit_my_reduce
    WHERE
      DATE_FORMAT( date, '%Y-%m-%d' ) = CURRENT_DATE AND
      my_activit_id = "满减" AND
      ( status = '进行中' OR status LIKE '%天后结束%' OR status LIKE '%天结束%' ) 
    ),
    c AS (
    SELECT * FROM a
    UNION ALL
    SELECT * FROM b
    ),
    d AS (
    -- 门店信息
      SELECT * FROM test_shop_
    )
    SELECT
    d.shop_id '店铺编号',
    d.shop_name '店铺名称',
    IF(d.platform IS NULL, NULL, IF(d.platform = 1, '美团', '饿了么')) '平台',
    d.real_shop_name,
    d.person '责任人',
    d.leader '组长',
    d.new_person '新店责任人',
    c.title '活动类型',
    c.rule '活动规则',
    DATE_FORMAT(end_time, '%Y%m%d') '结束时间'
    FROM c RIGHT JOIN d ON c.shop_id = d.shop_id 
    ORDER BY real_shop_name, end_time`

const 库存过少检查 = `WITH
    a AS
    (
      SELECT
        wmpoiid,
        tagName,
        name,
        stock,
        maxStock
      FROM foxx_food_manage 
      WHERE 
      -- 	wmpoiid = 10056855 AND 
        date = CURRENT_DATE AND stock BETWEEN 0 AND 98
    ),
    b AS (
      SELECT
        shop_id,
        category_name,
        name,
        stock,
        max_stock
      FROM ele_food_manage
      WHERE
        insert_date > CURRENT_DATE AND stock BETWEEN 0 AND 98
    ),
    c AS (
        -- 门店信息
      SELECT * FROM test_shop_
    ),
    d AS (
      SELECT * FROM a
      UNION
      SELECT * FROM b
    )
    SELECT 
      c.shop_id 店铺id,
      c.shop_name 店名,
      IF(c.platform IS NULL, NULL, IF(c.platform = 1, '美团', '饿了么')) 平台,
      c.real_shop_name 物理店,
      c.person 责任人,
      c.leader 组长,
      c.new_person 新店责任人,
      c.real_shop_name 物理店,
      d.tagName 分类,
      d.name 商品,
      d.stock 库存,
      d.maxStock 最大库存
    FROM d JOIN c ON c.shop_id = d.wmpoiid
    ORDER BY 物理店`

const 查询商品多规格 = `-- 查询商品多规格问题
    WITH
    a AS (
    SELECT
      wmpoiid,
      tagName,
      name
    FROM
      foxx_food_manage
    WHERE
      date = CURRENT_DATE
      AND normNum > 1
      AND name NOT LIKE "%餐具%"
      AND name NOT LIKE "%DIY%"
    ),
    b AS (
      -- 门店信息
      SELECT * FROM test_shop_
    )
    SELECT
    b.shop_id AS "店铺id",
    b.shop_name AS "店铺名称",
    IF(b.platform IS NULL, NULL, IF(b.platform = 1, '美团', '饿了么')) "平台",
    b.real_shop_name AS "物理店",
    b.person AS "责任人",
    b.leader AS "组长",
    b.new_person AS "新店责任人",
    tagName AS "分类名",
    name AS "商品名"
    FROM a JOIN b ON a.wmpoiid = b.shop_id
    ORDER BY 物理店`

const 推广费余额 = d => `-- 饿了么推广费
    SELECT shop_id, r.shop_name, a.platform, r.real_shop_name,  
      r.person, r.leader, r.new_person, balances FROM 
    (SELECT
      shop_id,
      '饿了么' platform,
      GROUP_CONCAT(balance - cs_market_balance - sa_market_balance - ad_market_balance SEPARATOR '->') balances
    FROM
      ele_activi_list
    WHERE 
      insert_date > DATE_SUB(CURDATE(),INTERVAL ${d} DAY)
    GROUP BY shop_id
    UNION ALL 
    -- 美团推广费
    SELECT
      wmpoiid,
      '美团' platform,
      GROUP_CONCAT(balance / 100 SEPARATOR '->') balances
    FROM foxx_collection_moment 
    WHERE 
      date > DATE_SUB(CURDATE(),INTERVAL ${d} DAY)
    GROUP BY wmpoiid) a
    LEFT JOIN test_shop_ r USING(shop_id)`

const 合作方案到期 = `WITH
    a AS (
    SELECT shop_id, invalidTime FROM ele_packs_contract_service WHERE insert_date > CURRENT_DATE
    ),
    b AS (
    -- 门店信息
    SELECT * FROM test_shop_ WHERE platform = 2
    )
    SELECT
    b.shop_id 店铺id,
    b.shop_name 店铺名称,
    b.person 责任人,
    b.real_shop_name 物理店,
    IFNULL(IF( b.platform = 1, '美团', '饿了么' ),NULL) 平台,
    CASE
    WHEN invalidTime IS NULL THEN '没有生效的方案'
    WHEN invalidTime < DATE_ADD( CURRENT_DATE, INTERVAL 7 DAY ) THEN '方案七天内到期'
    ELSE '无问题' END 问题 ,
    a.invalidTime 到期时间 
    FROM
    a RIGHT JOIN b ON a.shop_id = b.shop_id
    HAVING 问题 <> '无问题'
    ORDER BY 责任人`

const 起送价变化 = `WITH
    a AS (
    SELECT 
      wmpoiid,
      minPrice,
      LAG( minPrice, 1 ) OVER(PARTITION BY wmpoiid ORDER BY insert_date) lastMinPrice,
      DATE_FORMAT( insert_date, "%Y%m%d" ) date
    FROM foxx_spareas_info
    WHERE insert_date > DATE_SUB(CURRENT_DATE,INTERVAL 1 DAY)
    ),
    b AS (
    SELECT
      shop_id,
      price_items minPrice,
      LAG( price_items , 1 ) OVER(PARTITION BY shop_id ORDER BY insert_date) lastMinPrice,
      DATE_FORMAT( insert_date, "%Y%m%d" ) date
    FROM ele_delivery_fee
    WHERE shop_product_desc IN ( '蜂鸟快送', '蜂鸟众包', '蜂鸟专送', '自配送', 'e配送', '混合送' )
    AND insert_date > DATE_SUB(CURRENT_DATE,INTERVAL 1 DAY)
    ),
    c AS (
    SELECT * FROM a WHERE minPrice <> lastMinPrice
    UNION ALL
    SELECT * FROM b WHERE minPrice <> lastMinPrice
    ),
    d AS (
    -- 门店信息
      SELECT * FROM test_shop_ 
    )
    SELECT d.person, d.leader, d.new_person, d.real_shop_name,
    CASE
    WHEN d.platform = 1 THEN "美团"
    ELSE "饿了么"
    END platform,
    d.shop_id, d.shop_name,
    c.minPrice "起送价",
    c.lastMinPrice "前一天起送价",
    date AS "查询日期"
    FROM c JOIN d ON c.wmpoiid = d.shop_id
    WHERE date = DATE_FORMAT( CURRENT_DATE, "%Y%m%d" )
    ORDER BY real_shop_name`

const 百亿补贴没有报名 = `WITH
    a AS (
    SELECT * FROM ele_bybt WHERE insert_date > CURRENT_DATE AND can_apply = 1
    ),
    b AS (
    SELECT
      shop_id
    FROM
      ele_activity_full_reduction 
    WHERE
      insert_date > CURRENT_DATE AND
      title = '百亿补贴' AND
      descs NOT IN ('已结束', '已作废') AND
      ISNULL( conflict_message )
    ),
    c AS (
    -- 门店信息
    SELECT * FROM test_shop_
    )
    SELECT 
    c.shop_id,
    c.shop_name,
    c.person,
    c.real_shop_name,
    a.by_name 可报名活动
    FROM a LEFT JOIN b ON a.shop_id = b.shop_id JOIN c ON a.shop_id = c.shop_id 
    WHERE b.shop_id IS NULL 
    ORDER BY c.shop_id
`

const 单产品满减问题 = `-- 单商品满减查询
    -- EXPLAIN
    WITH
    a AS (
    -- 门店满减档位
      SELECT
        wmpoiid,
        CONVERT(SUBSTR(detail FROM 11 for 2), UNSIGNED INTEGER) detail
      FROM 
        foxx_market_activit_my_reduce
      WHERE 
        date = CURRENT_DATE
        AND my_activit_id = "满减"
        AND status = '进行中'
    ),
    b AS (
    -- 满减商品信息
      SELECT
        wmpoiid,
        name,
        tagName,
        price / 100 AS price,
        boxPrice,
        minOrderCount
      FROM
        foxx_food_manage FORCE INDEX(idx_date)
      WHERE
        date = DATE_FORMAT(CURRENT_DATE,"%Y%m%d")
        AND name NOT LIKE "%套餐%"
        AND name NOT LIKE "%鸡爪%"
        AND price * minOrderCount < 1980
    ),
    c AS (-- 饿了么满减档位
      SELECT 
        shop_id,
        CONVERT(SUBSTR(rule FROM 2 FOR 2), UNSIGNED INTEGER) rule
      FROM 
        ele_activity_full_reduction 
      WHERE 
        insert_date > CURRENT_DATE
        AND title IN ("店铺满减","智能满减")
        AND ISNULL(conflict_message) 
        AND (
          descs = '进行中'
          OR descs LIKE '%天后结束%'
          )
      UNION ALL
      SELECT 
        shop_id,
        CONVERT(SUBSTR(rule FROM 7 FOR 2), UNSIGNED INTEGER) rule
      FROM 
        ele_activity_full_reduction 
      WHERE 
        insert_date > CURRENT_DATE
        AND title IN ("百亿补贴")
        AND ISNULL(conflict_message) 
        AND (
          descs = '进行中'
          OR descs LIKE '%天后结束%'
        )
    ),
    d AS (
    -- 满减商品信息
      SELECT
        shop_id, 
        name,
        category_name,
        price,
        package_fee,
        min_purchase_quantity
      FROM 
        ele_food_manage
      WHERE
        bach_date = DATE_FORMAT(CURRENT_DATE,"%Y%m%d") 
        AND name NOT LIKE "%套餐%"
        AND name NOT LIKE "%鸡爪%"
        AND price * min_purchase_quantity < 19.8
    ),
    e AS (
      SELECT shop_id, shop_name, IF(platform = 1, '美团', '饿了么') platform, city, real_shop_name, person, leader FROM test_shop_ 
    ),
    f AS (
    -- 美团
      SELECT
        b.*,detail
      FROM a JOIN b ON a.wmpoiid = b.wmpoiid AND (price + boxPrice) * minOrderCOunt > detail
      UNION ALL
      -- 饿了么
      SELECT
        d.*,rule
      FROM c JOIN d ON c.shop_id = d.shop_id AND (price + package_fee) * min_purchase_quantity > rule
    )
    SELECT e.*, tagName, name, price, boxPrice, minOrderCount, detail FROM e JOIN f ON e.shop_id = f.wmpoiid
    ORDER BY real_shop_name`

const 工单优化指标 = (d0, d1) => `SET @date0 = ${d0};
    SET @date1 = ${d1};

    WITH
    a AS (
      SELECT
        person AS person,
        shop_id,
      IF
        (( cost_ratio >= 0.5 ), 1, NULL ) AS is_gcb,
      IF
        (( consume_ratio >= 0.05 ), 1, NULL ) AS is_gtg,
      IF
        (( settlea_30 <= 0.7 ), 1, NULL ) AS is_cd,(
        CASE
            WHEN ( platform = '美团' ) THEN
          IF
            (( income < 1500 ), 1, NULL ) ELSE
          IF
            (( income < 1000 ), 1, 0 ) 
          END 
          ) AS is_dsr,
          nullif(
            trim(
              json_unquote(
                json_extract(
                  cast( a AS json ),
                  json_unquote(
                  REPLACE ( json_search( cast( a AS json ), 'one', '高成本' ), 'q', 'a' ))))),
            '' 
          ) AS gcb,
          nullif(
            trim(
              json_unquote(
                json_extract(
                  cast( a AS json ),
                  json_unquote(
                  REPLACE ( json_search( cast( a AS json ), 'one', '高推广' ), 'q', 'a' ))))),
            '' 
          ) AS gtg,
          nullif(
            trim(
              json_unquote(
                json_extract(
                  cast( a AS json ),
                  json_unquote(
                  REPLACE ( json_search( cast( a AS json ), 'one', '严重超跌' ), 'q', 'a' ))))),
            '' 
          ) AS cd,
          nullif(
            trim(
              json_unquote(
                json_extract(
                  cast( a AS json ),
                  json_unquote(
                  REPLACE ( json_search( cast( a AS json ), 'one', '低收入' ), 'q', 'a' ))))),
            '' 
          ) AS dsr,
          IF( LEAD(cost_ratio,8,1) OVER(PARTITION BY person,shop_id ORDER BY date) >= 0.5 , 1, 0) +
          IF( LEAD(cost_ratio,9,1) OVER(PARTITION BY person,shop_id ORDER BY date) >= 0.5 , 1, 0) +
          IF( LEAD(cost_ratio,10,1) OVER(PARTITION BY person,shop_id ORDER BY date) >= 0.5 , 1, 0) is_gcb_then,
          IF( LEAD(consume_ratio,8,1) OVER(PARTITION BY person,shop_id ORDER BY date) >= 0.05 , 1, 0) +
          IF( LEAD(consume_ratio,9,1) OVER(PARTITION BY person,shop_id ORDER BY date) >= 0.05 , 1, 0) +
          IF( LEAD(consume_ratio,10,1) OVER(PARTITION BY person,shop_id ORDER BY date) >= 0.05 , 1, 0) is_gtg_then,
          IF( LEAD(settlea_30,8,0) OVER(PARTITION BY person,shop_id ORDER BY date) <= 0.7 , 1, 0) +
          IF( LEAD(settlea_30,9,0) OVER(PARTITION BY person,shop_id ORDER BY date) <= 0.7 , 1, 0) +
          IF( LEAD(settlea_30,10,0) OVER(PARTITION BY person,shop_id ORDER BY date) <= 0.7 , 1, 0) is_cd_then,
          CASE
          WHEN ( platform = '美团' ) THEN
          IF( LEAD(income,8,0) OVER(PARTITION BY shop_id ORDER BY date) < 1500 , 1, 0) +
          IF( LEAD(income,9,0) OVER(PARTITION BY shop_id ORDER BY date) < 1500 , 1, 0) +
          IF( LEAD(income,10,0) OVER(PARTITION BY shop_id ORDER BY date) < 1500 , 1, 0)
          ELSE
          IF( LEAD(income,8,0) OVER(PARTITION BY shop_id ORDER BY date) < 1000 , 1, 0) +
          IF( LEAD(income,9,0) OVER(PARTITION BY shop_id ORDER BY date) < 1000 , 1, 0) +
          IF( LEAD(income,10,0) OVER(PARTITION BY shop_id ORDER BY date) < 1000 , 1, 0)
          END is_dsr_then,
          date
        FROM
          test_analyse_t_
        WHERE
          person IS NOT NULL 
          AND person NOT IN ( '郑刚', '欧勇杰' )
      AND date BETWEEN @date0 AND DATE_FORMAT(DATE_ADD(@date1, INTERVAL 10 DAY), "%Y%m%d")
    ),
    b AS (
      SELECT
          person '运营',
          count(is_gcb) '高成本问题',
          count(gcb) '高成本优化',
          count(IF(gcb IS NOT NULL AND is_gcb_then = 0,1,NULL)) '高成本解决',
          count(is_gtg) '高推广问题',
          count(gtg) '高推广优化',
          count(IF(gtg IS NOT NULL AND is_gtg_then = 0,1,NULL)) '高推广解决',
          count(is_cd) '超跌问题',
          count(cd) '超跌优化',
          count(IF(cd IS NOT NULL AND is_cd_then = 0,1,NULL)) '超跌解决',
          count(is_dsr) '低业绩问题',
          count(dsr) '低业绩优化',
          count(IF(dsr IS NOT NULL AND is_dsr_then = 0,1,NULL)) '低业绩解决'
      FROM a 
      WHERE date BETWEEN @date0 AND @date1
      GROUP BY person
    )
    SELECT
      *,
      高成本问题 + 高推广问题 + 超跌问题 + 低业绩问题 AS '问题总数',
      高成本优化 + 高推广优化 + 超跌优化 + 低业绩优化 AS '优化总数',
      高成本解决 + 高推广解决 + 超跌解决 + 低业绩解决 AS '解决总数',
      ( 高成本优化 + 高推广优化 + 超跌优化 + 低业绩优化 ) / ( 高成本问题 + 高推广问题 + 超跌问题 + 低业绩问题 ) AS '优化率',
      ( 高成本解决 + 高推广解决 + 超跌解决 + 低业绩解决 ) / ( 高成本优化 + 高推广优化 + 超跌优化 + 低业绩优化 ) AS '解决率' 
    FROM
    	b`

const 饿了么其它活动检查 = `WITH
    a AS (
        SELECT
        x.shop_id,
        x1.shop_name,
        y.shop_address,
        y.real_shop_name,
        z.nick_name person
      FROM
        platform_shops x
        JOIN base_physical_shops y ON x.physical_id = y.id AND x.is_delete = 0 AND y.is_delete = 0
        JOIN sys_user z ON y.user_id = z.user_id
        JOIN (
          SELECT shop_id,shop_name FROM ele_info_manage WHERE status = 0
          UNION ALL
          SELECT wmpoiid, reptile_type FROM foxx_shop_reptile WHERE status = 0
        ) x1 ON x1.shop_id = x.shop_id
    ),
    b AS (
      SELECT
        shop_id,
        MAX(if(title = '超级吃货红包', rule, null)) 超级吃货红包,
        MAX(if(title = '下单返红包', rule, null)) 下单返红包,
        MAX(if(title = '吃货红包', rule, null)) 吃货红包,
        MAX(if(title = '集点返红包', rule, null)) 集点返红包,
        MAX(if(title = '店铺满赠', rule, null)) 店铺满赠,
        MAX(if(title = '进店领红包', rule, null)) 进店领红包
      FROM ele_activity_full_reduction 
      WHERE insert_date > CURRENT_DATE
      AND descs = '进行中'
      GROUP BY shop_id
    )
    SELECT 
      a.shop_id,
      real_shop_name,
      shop_name,
      person,
      超级吃货红包,
      下单返红包,
      吃货红包,
      集点返红包,
      店铺满赠,
      进店领红包
    FROM a JOIN b ON a.shop_id = b.shop_id`

const 美团其它活动检查 = `WITH
    a AS (
        SELECT
        x.shop_id,
        x1.shop_name,
        y.shop_address,
        y.real_shop_name,
        z.nick_name person
      FROM
        platform_shops x
        JOIN base_physical_shops y ON x.physical_id = y.id AND x.is_delete = 0 AND y.is_delete = 0
        JOIN sys_user z ON y.user_id = z.user_id
        JOIN (
          SELECT shop_id,shop_name FROM ele_info_manage WHERE status = 0
          UNION ALL
          SELECT wmpoiid, reptile_type FROM foxx_shop_reptile WHERE status = 0
        ) x1 ON x1.shop_id = x.shop_id
    ),
    b AS (
      SELECT
        wmpoiid shop_id,
        MAX(if(name = '收藏有礼', detail, null)) 收藏有礼,
        MAX(if(name = '店内领券', detail, null)) 店内领券,
        MAX(if(name = '超值换购', detail, null)) 超值换购,
        MAX(if(name = '满赠活动', detail, null)) 满赠活动,
        MAX(if(name = '下单返券', detail, null)) 下单返券,
        MAX(if(name = '集点返券', detail, null)) 集点返券,
        MAX(if(name = '新客立减（平台）', detail, null)) 新客立减（平台）,
        MAX(if(name = '店外发券', detail, null)) 店外发券,
        MAX(if(name = '售卖代金券', detail, null)) 售卖代金券,
        MAX(if(name = '门店新客立减', detail, null)) 门店新客立减
      FROM foxx_market_activit_my WHERE date = CURRENT_DATE AND status_desc = '进行中'
      GROUP BY wmpoiid
    )
    SELECT 
      a.shop_id,
      real_shop_name,
      shop_name,
      person,
      收藏有礼,
      店内领券,
      超值换购,
      满赠活动,
      下单返券,
      集点返券,
      新客立减（平台）,
      店外发券,
      售卖代金券
    FROM a JOIN b ON a.shop_id = b.shop_id`

async function date(d) {}

async function addNewShop(
  platform,
  shopId,
  shopName,
  roomId,
  realName,
  city,
  person,
  newPerson,
  bd,
  phone,
  isD,
  isM,
  rent,
  project_id
) {
  try {
    roomId = roomId.trim()
    let results = {},
      real_shop_id = ""
    const realShops = await knx("foxx_real_shop_info").select()
    realShops.find(v => v.real_shop_name == realName)
      ? (real_shop_id = realShops.find(v => v.real_shop_name == realName).real_shop_id)
      : (real_shop_id = Math.max(...realShops.map(v => v.real_shop_id)) + 1)

    if (platform == 2) {
      // manager = await knx('ele_shop_manager')
      // .where(
      //   'insert_date',
      //   '>',
      //   dayjs()
      //     .startOf('day')
      //     .subtract(1, 'day')
      //     .format('YYYYMMHH')
      // )
      // .andWhere({ shop_id: shopId })
      // .first()

      const { ks_id } = await knx(`ele_info_manage`).first("ks_id")
      const res1 = await knx(`ele_info_manage`)
        .insert({ shop_id: shopId, shop_name: shopName, ks_id, status: 0 })
        .onConflict("shop_id")
        .merge()
      results.res1 = res1
    } else if (platform == 1) {
      // bd = await knx('foxx_business_manager_info')
      // .where({ wmpoiid: shopId })
      // .first()
      // bd = bd.name

      const res1 = await knx(`foxx_shop_reptile`)
        .insert({ wmpoiid: shopId, reptile_type: shopName, project_id })
        .onConflict("wmpoiid")
        .merge()
      results.res1 = res1
    }
    const res2 = await knx(`foxx_message_room`)
      .insert({ wmpoiid: shopId, roomName: shopName, roomId })
      .onConflict("wmpoiid")
      .merge()
    results.res2 = res2

    const res3 = await knx(`foxx_real_shop_info`)
      .insert({
        real_shop_id,
        real_shop_name: realName,
        shop_id: shopId,
        room_id: roomId,
        platform,
        city,
        person,
        new_person: newPerson,
        bd,
        shop_phone: phone,
        is_original_price_deduction_point: isD,
        is_merit_based_activity: isM,
        rent,
        is_delete: 0,
      })
      .onConflict("shop_id")
      .merge()
    results.res3 = res3
    return Promise.resolve(results)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function addFengniao(shopId, shopName, loginName, password) {
  try {
    const res = await knx(`ele_fengniao_info`)
      .insert({
        shop_id: shopId,
        shop_name: shopName,
        loginName,
        password,
      })
      .onConflict("shop_id")
      .merge()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function addDada(shopId, shopName, username, password) {
  try {
    const { status, content } = await loginDada(username, password)
    if (status != "ok") return Promise.reject("达达登录失败")
    const { supplierId, accessToken } = content
    const res = await knx(`dd_login_info`)
      .insert({
        shop_id: shopId,
        shop_name: shopName,
        username,
        pw: password,
        user_id: supplierId,
        token: accessToken,
        status: 0,
      })
      .onConflict("shop_id")
      .merge()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function loginDada(username, password) {
  try {
    var data = `{"accountType":2,"code":"","loginType":"password","password":"${password}","token":"","username":"${username}"}`

    var config = {
      method: "post",
      url: "https://supplier-api.imdada.cn/v1/login",
      headers: {
        "Enable-Gps": "1",
        Accuracy: "550.0",
        Model: "Android-MI_9",
        "City-Id": "0",
        "User-Token": "1",
        "City-Code": "010",
        "Client-MacAddress": "02:00:00:00:00:02",
        "Rate-Limit-Hash": "2e6e6a654a88fcc8289c162e2c5db0e1",
        "Location-Provider": "lbs",
        "Channel-ID": "CPA006",
        Lng: "116.410344",
        "User-Id": "0",
        "App-Version": "8.2.0",
        Operator: "ChinaMobile",
        "OS-Version": "7.1.2",
        Lat: "39.916295",
        UUID: "ffffffff-fd1b-7a8d-e826-db5b00000000",
        "Client-Time": "1606389139648",
        "Request-Id": "62f8bfc5-b35f-449c-a6a6-c6724f625a7e",
        Platform: "Android",
        "App-Name": "a-shop",
        "Ad-Code": "110101",
        "Sdcard-Id": "219bb10e76f64599b3b10ab8f52f3018",
        "Client-Imei": "865166027515306",
        Network: "WIFI",
        "Client-Imsi": "460000409278205",
        "Location-Time": "1606389042484",
        "Verification-Hash": md5(data + "Athens"),
        "Content-Type": "application/json; charset=UTF-8",
        Host: "supplier-api.imdada.cn",
        "User-Agent": "okhttp/3.10.0",
      },
      data: data,
    }

    const res = await axios(config)
    return Promise.resolve(res.data)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function addShunfeng(shopId, shopName, username, password) {
  try {
    let l = await loginShunfeng(username, password)
    if (l.data.errno != 0) return Promise.reject("顺丰登录失败")

    const res = await knx(`sf_express_user_info`)
      .insert({
        shop_id: shopId,
        shop_name: shopName,
        user_name: username,
        user_pass: password,
        is_status: 0,
        is_delete: 0,
      })
      .onConflict("shop_id")
      .merge()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function loginShunfeng(username, password) {
  let key = "BJFCMLCCBJFCMLCC"
  try {
    var data = qs.stringify({
      platform: "crm",
      cuid: "6437BC95DFB8B8DCAE54C83D049165CE|0",
      appid: "87634392",
      channel: "android",
      ENV_LANG: "zh",
      app_version: "4.0.1",
      uname: `${username}`,
      upass: `${encrypt(password)}`,
    })
    var config = {
      method: "post",
      url: "https://passtc.sf-express.com/api/loginv2",
      headers: {
        COOKIE: "",
        ENV_LANG: "zh",
        "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 7.1.2; MI 9 Build/N2G48C)",
        Host: "passtc.sf-express.com",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    }

    const res = await axios(config)
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }

  function encrypt(password) {
    return CryptoJS.AES.encrypt(
      Buffer.from(password)
        .toString("base64")
        .split("")
        .reverse()
        .join(""),
      CryptoJS.enc.Utf8.parse(key),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString()
  }
}

async function addMyt(shopId, loginName, password) {
  try {
    const { message, data } = await loginMyt(loginName, password)
    if (message != "") return Promise.reject(message)
    const { token } = data
    const res = await knx(`myt_login_info`)
      .insert({
        shop_id: shopId,
        login_name: loginName,
        pw: password,
        token,
      })
      .onConflict("shop_id")
      .merge()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function loginMyt(username, password) {
  try {
    var data = `username=${username}&password=${password}&cid=&token=&v=3.4.0`

    var config = {
      method: "post",
      url: "https://app.saas.maiyatian.com/login/in/",
      headers: {
        Host: "app.saas.maiyatian.com",
        Cookie: "PHPSESSID=288581lk05ptplk0704m3bld54",
        origin: "file://",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 7.1.2; TAS-AN00 Build/N2G48C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36 Html5Plus/1.0 (Immersed/24.0)",
        "content-type": "application/x-www-form-urlencoded",
        accept: "*/*",
        "accept-language": "zh-CN,en-US;q=0.9",
        "x-requested-with": "io.dcloud.maiyatian",
      },
      data: data,
    }

    const res = await axios(config)
    console.log(res.data)
    return Promise.resolve(res.data)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function delFengniao(shopId, loginName) {
  try {
    const res = await knx(`ele_fengniao_info`)
      .where({ shop_id: shopId, loginName })
      .del()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function delDada(shopId, username) {
  try {
    const res = await knx(`dd_login_info`)
      .where({ shop_id: shopId, username })
      .del()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function delShunfeng(shopId, username) {
  try {
    const res = await knx(`sf_express_user_info`)
      .where({ shop_id: shopId, user_name: username })
      .del()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function delMyt(shopId, loginName) {
  try {
    const res = await knx(`myt_login_info`)
      .where({ shop_id: shopId, login_name: loginName })
      .del()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function shopActsDiff() {
  try {
    let data = await Promise.all([
      knx.raw(elm_shop_acts_diff),
      knx.raw(mt_shop_acts_diff),
      knx.raw(mt_spareas_diff),
      knx.raw(elm_spareas_diff),
      // knx.raw(elm_foods_diff),
      // knx.raw(mt_foods_diff),
      // knx.raw(mt_discounts_diff),
      knx.raw(mt_shop_cate_diff),
    ])
    data = data.map(v => v[0])
    data = [
      ...data[0],
      ...data[1],
      ...data[2].map(v => ({
        ...v,
        rule: `面积：${v.logisticsAreas}\n起送价：${v.minPrice}\n配送费：${v.shippingFee}`,
      })),
      ...data[3].map(v => ({
        ...v,
        rule: `${v.shop_product_desc}\n起送价：${v.price_items}\n配送费：${v.delivery_fee_items}`,
      })),
      // ...data[4].map(v => ({
      //   ...v,
      //   rule: `${v.category_name}  ${v.on_shelf == '下架' ? '下架' : ''}\n${v.name}\n价格：${v.price} / ${
      //     v.activity_price
      //   }\n餐盒费：${v.package_fee}\n最小起购：${v.min_purchase_quantity}`
      // })),
      // ...data[5].map(v => ({
      //   ...v,
      //   rule: `${v.tagName}  ${v.sellStatus == 1 ? '下架' : ''}\n${v.name}\n价格：${v.price / 100}\n餐盒费：${
      //     v.boxPrice
      //   }`
      // })),
      // ...data[4].map(v => ({
      //   ...v,
      //   rule: `${v.itemName}\n价格：${v.actInfo} / ${v.actPrice}\n限购：${v.orderLimit}`
      // })),
      ...data[4].map(v => ({
        ...v,
        rule: `主营：${v.mainCategory}\n辅营：${v.supplementCategory}`,
      })),
    ].sort((a, b) => a.shop_id - b.shop_id)
    // console.log(data)
    let res = new M(data).bind(split)

    let saveRes = await knx("test_change_t_")
      .insert(
        res.val.map(v => ({
          ...v,
          after_rule: JSON.stringify(v.after_rule),
          before_rule: JSON.stringify(v.before_rule),
        }))
      )
      .onConflict("key")
      .merge()
    console.log("shopActsDiff", saveRes)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function split(xs) {
    let distinct_shop_titles = Array.from(new Set(xs.map(v => `${v.shop_id}|${v.title}`)))
    let ys = distinct_shop_titles.map(shop_title => {
      let shop_id = shop_title.split("|")[0]
      let title = shop_title.split("|")[1]
      let shop_name = xs.find(k => k.shop_id == shop_id)?.shop_name
      let person = xs.find(k => k.shop_id == shop_id)?.person
      let platform = xs.find(k => k.shop_id == shop_id)?.platform
      let real_shop_name = xs.find(k => k.shop_id == shop_id)?.real_shop_name
      let leader = xs.find(k => k.shop_id == shop_id)?.leader
      let after_rule = xs
        .filter(k => k.shop_id == shop_id && k.title == title && dayjs(k.insert_date).isSame(dayjs(), "day"))
        .map(k => ({ rule: k.rule, date: k.date, insert_date: dayjs(k.insert_date).format("YYYY-MM-DD HH:mm:ss") }))
      let before_rule = xs
        .filter(
          k =>
            k.shop_id == shop_id && k.title == title && dayjs(k.insert_date).isSame(dayjs().subtract(1, "day"), "day")
        )
        .map(k => ({ rule: k.rule, date: k.date, insert_date: dayjs(k.insert_date).format("YYYY-MM-DD HH:mm:ss") }))
      return {
        key: `${shop_id}-${title}-${dayjs().format("YYYYMMDD")}`,
        shop_id,
        shop_name,
        platform,
        real_shop_name,
        person,
        leader,
        title,
        after_rule,
        before_rule,
        change_date: dayjs().format("YYYYMMDD"),
        handle: "",
      }
    })
    return new M(ys)
  }
}

async function saveShopActsDiff(key, handle) {
  try {
    return knx("test_change_t_")
      .where({ key })
      .update({ handle })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function saveProbs(type, key, handle) {
  try {
    return knx("test_prob_t_")
      .insert({ type, key, handle, updated_at: dayjs().format("YYYY-MM-DD") })
      .onConflict(["type", "key", "updated_at"])
      .merge()
  } catch (e) {
    return Promise.reject(e)
  }
}

async function saveFreshA(wmpoiid, a2, updated_at) {
  try {
    return knx("new_shop_track_copy1")
      .insert({
        wmpoiid,
        a2,
        updated_at,
      })
      .onConflict(["wmpoiid", "updated_at"])
      .merge()
  } catch (e) {
    return Promise.reject(e)
  }
}

async function saveNote(key, title, description, content, images) {
  try {
    return knx("test_notes_t_")
      .insert({
        key,
        title,
        description,
        content,
        images,
        updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .onConflict("key")
      .merge()
  } catch (e) {
    return Promise.reject(e)
  }
}

async function likeNote(key, ip) {
  try {
    const data = await knx("test_notes_t_")
      .where({ key })
      .first()
    if (!data) return Promise.reject("no data")
    if (data.likes.includes(ip)) return Promise.reject("liked")
    return knx("test_notes_t_")
      .where({ key })
      .update({ likes: data.likes != "" ? `${data.likes}|${ip}` : ip })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function commentNote(key, ip, comment) {
  try {
    const data = await knx("test_notes_t_")
      .where({ key })
      .first()
    if (!data) return Promise.reject("no data")
    let com = { id: uuid.v4(), ip, comment, replies: [], inserted_at: dayjs().format("YYYY-MM-DD HH:mm:ss") }
    let coms = data.comments ? [...JSON.parse(data.comments), com] : [com]

    const res = await knx("test_notes_t_")
      .where({ key })
      .update({ comments: JSON.stringify(coms) })
    if (res != 1) return Promise.reject("error")
    return Promise.resolve(JSON.stringify(coms))
  } catch (e) {
    return Promise.reject(e)
  }
}

async function delNote(key) {
  try {
    return knx("test_notes_t_")
      .where({ key })
      .del()
  } catch (e) {
    return Promise.reject(e)
  }
}

async function ts() {
  try {
    let data = await readXls("plan/Book 1.xlsx", "Sheet1")
    let res = new M(data)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function matrix(xs) {
    let ys = xs.map(x => [
      x.city,
      x.person,
      x.real_shop,
      x.shop_id,
      x.shop_name,
      x.platform,
      x.income,
      x.third_send,
      x.consume,
      x.consume_ratio,
      x.income_sum,
      x.consume_sum,
      x.consume_sum_ratio,
      x.cost,
      x.cost_ratio,
      x.orders,
      x.unit_price,
      x.settlea_30,
      x.settlea_1,
      x.settlea_7,
      x.settlea_7_3,
      x.date,
    ])
    return new M(ys)
  }
}

async function sum(date, raw) {
  let data2 = { shops: [] }
  try {
    let [data, _] = await knx.raw(sum_sql(date))
    data = data[2]
    // data2 = await sum2()
    if (!data) return Promise.reject("no data")

    if (raw) return data

    let res = new M(data)
      .bind(format)
      .bind(sum_)
      .bind(split_shop)
    // .bind(extend)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function format(xs) {
    let ys = xs.map(v => ({
      ...v,
      city: empty(v.city),
      person: empty(v.person),
      leader: empty(v.leader),
      real_shop: empty(v.real_shop),
      income_sum: fixed2(v.income_sum),
      consume_sum: fixed2(v.consume_sum),
      cost_sum: fixed2(v.cost_sum),
      income_sum_15: fixed2(v.income_sum_15),
      income_sum_sum: fixed2(v.income_sum_sum),
      consume_sum_sum: fixed2(v.consume_sum_sum),
      cost_sum_sum: fixed2(v.cost_sum_sum),
      consume_sum_ratio: percent(v.consume_sum_ratio),
      cost_sum_ratio: percent(v.cost_sum_ratio),
      consume_sum_sum_ratio: percent(v.consume_sum_sum_ratio),
      cost_sum_sum_ratio: percent(v.cost_sum_sum_ratio),
      rent_cost: fixed2(v.rent_cost),
      labor_cost: fixed2(v.labor_cost),
      water_electr_cost: fixed2(v.water_electr_cost),
      cashback_cost: fixed2(v.cashback_cost),
      oper_cost: fixed2(v.oper_cost),
      profit: fixed2(v.profit),
      profit_month: fixed2(v.profit_month),
      before_30_profit: fixed2(v.before_30_profit),
      month_on_month_ratio_profit: percent(v.month_on_month_ratio_profit),
    }))
    return new M(ys)
  }

  function sum_(xs) {
    let dates = distinct(xs, "date")
    for (let da of dates) {
      let data = xs.find(v => v.date == da)
      if (data)
        xs.push({
          city: "总计",
          person: "总计",
          real_shop: "总计",
          income_sum: data.income_sum_sum,
          consume_sum: data.consume_sum_sum,
          cost_sum: data.cost_sum_sum,
          consume_sum_ratio: data.consume_sum_sum_ratio,
          cost_sum_ratio: data.cost_sum_sum_ratio,
          rent_cost: fixed2(xs.filter(x => x.date == da).reduce((s, v) => s + parseFloat_0(v.rent_cost), 0)),
          labor_cost: fixed2(xs.filter(x => x.date == da).reduce((s, v) => s + parseFloat_0(v.labor_cost), 0)),
          water_electr_cost: fixed2(
            xs.filter(x => x.date == da).reduce((s, v) => s + parseFloat_0(v.water_electr_cost), 0)
          ),
          cashback_cost: fixed2(xs.filter(x => x.date == da).reduce((s, v) => s + parseFloat_0(v.cashback_cost), 0)),
          oper_cost: fixed2(xs.filter(x => x.date == da).reduce((s, v) => s + parseFloat_0(v.oper_cost), 0)),
          profit: fixed2(xs.filter(x => x.date == da).reduce((s, v) => s + parseFloat_0(v.profit), 0)),
          profit_month: fixed2(xs.filter(x => x.date == da).reduce((s, v) => s + parseFloat_0(v.profit_month), 0)),
          date: da,
        })
    }
    return new M({
      xs,
      dates,
    })
  }

  function split_shop({ xs, dates }) {
    if (!xs) return []
    let distinct_shops = distinct(xs, "real_shop")
    let ys = distinct_shops.map(v => {
      let city = xs.find(k => k.real_shop == v).city
      let person = xs.find(k => k.real_shop == v).person
      let leader = xs.find(k => k.real_shop == v).leader
      let income_sums = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`income_sum_${c.date}`]: c.income_sum }), {})
      let consume_sums = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`consume_sum_${c.date}`]: c.consume_sum }), {})
      let cost_sums = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`cost_sum_${c.date}`]: c.cost_sum }), {})
      let consume_sum_ratios = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`consume_sum_ratio_${c.date}`]: c.consume_sum_ratio }), {})
      let cost_sum_ratios = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`cost_sum_ratio_${c.date}`]: c.cost_sum_ratio }), {})
      let rent_costs = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`rent_cost_${c.date}`]: c.rent_cost }), {})
      let labor_costs = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`labor_cost_${c.date}`]: c.labor_cost }), {})
      let water_electr_costs = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`water_electr_cost_${c.date}`]: c.water_electr_cost }), {})
      let cashback_costs = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`cashback_cost_${c.date}`]: c.cashback_cost }), {})
      let oper_costs = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`oper_cost_${c.date}`]: c.oper_cost }), {})
      let profits = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`profit_${c.date}`]: c.profit }), {})
      let profit_months = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`profit_month_${c.date}`]: c.profit_month }), {})
      let before_30_profit = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`before_30_profit_${c.date}`]: c.before_30_profit }), {})
      let month_on_month_ratio_profit = xs
        .filter(k => k.real_shop == v)
        .sort((a, b) => b.date - a.date)
        .reduce((o, c) => ({ ...o, [`month_on_month_ratio_profit_${c.date}`]: c.month_on_month_ratio_profit }), {})
      return {
        city,
        person,
        leader,
        real_shop: v,
        ...income_sums,
        ...consume_sums,
        ...cost_sums,
        ...consume_sum_ratios,
        ...cost_sum_ratios,
        ...rent_costs,
        ...labor_costs,
        ...water_electr_costs,
        ...cashback_costs,
        ...oper_costs,
        ...profits,
        ...before_30_profit,
        ...month_on_month_ratio_profit,
        // ...profit_months
      }
    })
    return new M({
      dates,
      shops: ys,
    })
  }

  function extend({ dates, shops }) {
    let y_shops = shops.map(shop => {
      let d = data2.shops.find(v => v.real_shop == shop.real_shop)
      return {
        ...shop,
        ...d,
      }
    })
    return new M({
      dates,
      months: data2.dates,
      shops: y_shops,
    })
  }
}

async function sum2() {
  try {
    let [data, _] = await knx.raw(sum_sql2)
    data = data[2]
    if (!data) return Promise.reject("no data")

    let res = new M(data)
      .bind(format)
      .bind(sum_)
      .bind(split_shop)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function format(xs) {
    let ys = xs.map(v => ({
      ...v,
      city: empty(v.city),
      person: empty(v.person),
      leader: empty(v.leader),
      real_shop: empty(v.real_shop),
      income_sum_month: fixed2(v.income_sum_month),
      consume_sum_month: fixed2(v.consume_sum_month),
      cost_sum_month: fixed2(v.cost_sum_month),
      consume_sum_ratio_month: percent(v.consume_sum_ratio_month),
      cost_sum_ratio_month: percent(v.cost_sum_ratio_month),
      rent_cost_month: fixed2(v.rent_cost_month),
      labor_cost_month: fixed2(v.labor_cost_month),
      water_electr_cost_month: fixed2(v.water_electr_cost_month),
      cashback_cost_month: fixed2(v.cashback_cost_month),
      oper_cost_month: fixed2(v.oper_cost_month),
      profit_month: fixed2(v.profit_month),
    }))
    return new M(ys)
  }

  function sum_(xs) {
    let dates = distinct(xs, "ym")
    for (let da of dates) {
      let data = xs.find(v => v.ym == da)
      if (data) {
        let income = xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.income_sum_month), 0)
        let consume = xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.consume_sum_month), 0)
        let cost = xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.cost_sum_month), 0)
        xs.push({
          city: "总计",
          person: "总计",
          real_shop: "总计",
          income_sum_month: fixed2(income),
          consume_sum_month: fixed2(consume),
          cost_sum_month: fixed2(cost),
          consume_sum_ratio_month: percent(consume / income),
          cost_sum_ratio_month: percent(cost / income),
          rent_cost_month: fixed2(xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.rent_cost_month), 0)),
          labor_cost_month: fixed2(
            xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.labor_cost_month), 0)
          ),
          water_electr_cost_month: fixed2(
            xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.water_electr_cost_month), 0)
          ),
          cashback_cost_month: fixed2(
            xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.cashback_cost_month), 0)
          ),
          oper_cost_month: fixed2(xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.oper_cost_month), 0)),
          profit_month: fixed2(xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.profit_month), 0)),
          ym: da,
        })
      }
    }

    // fs.writeFileSync('log/sum.json', JSON.stringify(xs))
    return new M({
      xs,
      dates,
    })
  }

  function split_shop({ xs, dates }) {
    if (!xs) return []
    let distinct_shops = distinct(xs, "real_shop")
    let ys = distinct_shops.map(v => {
      let city = xs.find(k => k.real_shop == v).city
      let person = xs.find(k => k.real_shop == v).person
      let leader = xs.find(k => k.real_shop == v).leader
      let income_sum_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`income_sum_month_${c.ym}`]: c.income_sum_month }), {})
      let consume_sum_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`consume_sum_month_${c.ym}`]: c.consume_sum_month }), {})
      let cost_sum_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`cost_sum_month_${c.ym}`]: c.cost_sum_month }), {})
      let consume_sum_ratio_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`consume_sum_ratio_month_${c.ym}`]: c.consume_sum_ratio_month }), {})
      let cost_sum_ratio_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`cost_sum_ratio_month_${c.ym}`]: c.cost_sum_ratio_month }), {})
      let rent_cost_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`rent_cost_month_${c.ym}`]: c.rent_cost_month }), {})
      let labor_cost_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`labor_cost_month_${c.ym}`]: c.labor_cost_month }), {})
      let water_electr_cost_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`water_electr_cost_month_${c.ym}`]: c.water_electr_cost_month }), {})
      let cashback_cost_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`cashback_cost_month_${c.ym}`]: c.cashback_cost_month }), {})
      let oper_cost_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`oper_cost_month_${c.ym}`]: c.oper_cost_month }), {})
      let profit_months = xs
        .filter(k => k.real_shop == v)
        .reduce((o, c) => ({ ...o, [`profit_month_${c.ym}`]: c.profit_month }), {})
      return {
        city,
        person,
        leader,
        real_shop: v,
        ...profit_months,
        ...income_sum_months,
        ...consume_sum_months,
        ...cost_sum_months,
        ...consume_sum_ratio_months,
        ...cost_sum_ratio_months,
        ...rent_cost_months,
        ...labor_cost_months,
        ...water_electr_cost_months,
        ...cashback_cost_months,
        ...oper_cost_months,
      }
    })
    return new M({
      dates,
      shops: ys,
    })
  }
}

///////////////////////////
/////////////////////////////
//name field 20210101 20210102
async function fresh() {
  try {
    let [data, _] = await knx.raw(fresh_sql)
    if (!data) return Promise.reject("no data")
    let res = new M(data).bind(format).bind(split_all)

    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function format(xs) {
    let ys = xs.map(v => ({
      ...v,
      name: v.platform == "美团" ? `${v.name}\t${v.platform}` : v.name,
      Entryrate: percent(v.Entryrate),
      Orderrate: percent(v.Orderrate),
      evaluate_over_order: percent(v.evaluate / v.order),
      cost_ratio: percent(v.cost_ratio),
      a2: {
        a2: v.a2,
        date: v.date,
        isYesterday: dayjs()
          .subtract(1, "day")
          .isSame(dayjs(v.date, "YYYYMMDD"), "date"),
      },
    }))
    return new M(ys)
  }

  function split_all(xs) {
    let names = distinct(xs, "name")
    let fields = {
      evaluate: "评论数",
      bad_order: "差评数",
      order: "单量",
      evaluate_over_order: "评论/单量",
      bizScore: "评分",
      moment: "推广",
      income: "营业额",
      unitPrice: "客单价",
      overview: "曝光量",
      Entryrate: "进店率",
      Orderrate: "下单率",
      cost_ratio: "成本比例",
      off_shelf: "下架产品量",
      over_due_date: "特权有效期",
      kangaroo_name: "袋鼠店长M",
      red_packet_recharge: "高佣返现M",
      ranknum: "商圈排名M",
      extend: "延迟发单E",
      a2: "优化",
    }
    let dates = distinct(xs, "date").sort((a, b) => b - a)
    let ys = names.map(name =>
      Object.keys(fields).map(field => {
        let values = dates.reduce((o, d) => {
          let v = xs.find(x => x.name == name && x.date == d)
          return { ...o, [d]: v ? v[field] : null }
        }, {})
        return {
          key: `${name}-${field}`,
          name,
          platform: xs.find(x => name.includes(x.name))?.platform,
          wmPoiId: xs.find(x => name.includes(x.name))?.wmPoiId,
          real_shop_name: xs.find(x => name.includes(x.name))?.real_shop_name,
          person: xs.find(x => name.includes(x.name))?.person,
          leader: xs.find(x => name.includes(x.name))?.leader,
          field: fields[field],
          ...values,
        }
      })
    )
    ys = flatten(ys)
    return new M({ shops: ys, dates })
  }
}

async function indices(platform, shopId, day) {
  try {
    day = parseInt(day)

    if (platform == "美团") {
      let data = await Promise.all([
        knx.raw(`${线下指标美团评分(shopId, day)}`),
        knx.raw(`${线下指标美团商责配送延迟率(shopId, day)}`),
        knx.raw(`${线下指标美团评价率差评率(shopId, day)}`),
        knx.raw(`${线下指标美团30天评价率(shopId)}`),
        knx.raw(`${线下指标美团30天商责配送延迟率(shopId, day)}`),
        knx.raw(`${线下指标美团商品数下架数(shopId, day)}`),
        knx.raw(`${线下指标美团关店次数(shopId, day)}`),
      ])
      data = data.map(v => v[0])
      let res = new M(data).bind(split)
      return Promise.resolve(res.val)
    } else if (platform == "饿了么") {
      let data = await Promise.all([
        knx.raw(`${线下指标饿了么评分(shopId, day)}`),
        knx.raw(`${线下指标饿了么评价率差评率(shopId, day)}`),
        knx.raw(`${线下指标饿了么30天评价率(shopId)}`),
        knx.raw(`${线下指标饿了么商品数下架数(shopId, day)}`),
      ])
      data = data.map(v => v[0])
      let res = new M(data).bind(split_elm)
      return Promise.resolve(res.val)
    }
  } catch (e) {
    return Promise.reject(e)
  }

  function split(xs) {
    let dateRange = [...Array(day)].map((_, i) =>
      dayjs()
        .subtract(i + 1, "day")
        .format("YYYY-MM-DD")
    )

    let ratings = dateRange.reduce((o, d) => {
      let v = xs[0].find(x => x.date == d)
      return { ...o, [d]: v ? v.bizscore : null, field: "评分" }
    }, {})
    let nocs = dateRange.reduce((o, d) => {
      let v = xs[1].find(x => x.date == d)
      return { ...o, [d]: v ? v.negotiable_order_cancellation : null, field: "商责取消数" }
    }, {})
    let ddrs = dateRange.reduce((o, d) => {
      let v = xs[1].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.distribution_delay_rate) : null, field: "配送延迟率" }
    }, {})
    let ers = dateRange.reduce((o, d) => {
      let v = xs[2].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.evaluation_rate) : null, field: "评价率" }
    }, {})
    let bers = dateRange.reduce((o, d) => {
      let v = xs[2].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.bad_evaluation_rate) : null, field: "一二星差评率" }
    }, {})
    let ers_30 = dateRange.reduce((o, d) => {
      let v = xs[3][0]
      return { ...o, [d]: v ? percent(v.evaluation_rate) : null, field: "30天评价率" }
    }, {})
    let nocs_30 = dateRange.reduce((o, d) => {
      let v = xs[4].find(x => x.date == d)
      return { ...o, [d]: v ? v.cancelOfPoiResCnt : null, field: "30天商责取消数" }
    }, {})
    let ddrs_30 = dateRange.reduce((o, d) => {
      let v = xs[4].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.delayRate) : null, field: "30天配送延迟率" }
    }, {})
    let fcs = dateRange.reduce((o, d) => {
      let v = xs[5].find(x => x.date == d)
      return { ...o, [d]: v ? v.food_cnt : null, field: "商品数" }
    }, {})
    let ofcs = dateRange.reduce((o, d) => {
      let v = xs[5].find(x => x.date == d)
      return { ...o, [d]: v ? v.off_shelf_cnt : null, field: "下架商品数" }
    }, {})
    let ocs = dateRange.reduce((o, d) => {
      let v = xs[6].find(x => x.date == d)
      return { ...o, [d]: v ? v.off_count : null, field: "关店数" }
    }, {})
    return new M({ data: [ratings, nocs, ddrs, ers, bers, ers_30, nocs_30, ddrs_30, fcs, ofcs, ocs], dates: dateRange })
  }

  function split_elm(xs) {
    let dateRange = [...Array(day)].map((_, i) =>
      dayjs()
        .subtract(i + 1, "day")
        .format("YYYY-MM-DD")
    )

    let ratings = dateRange.reduce((o, d) => {
      let v = xs[0].find(x => x.date == d)
      return { ...o, [d]: v ? v.rating : null, field: "评分" }
    }, {})
    let ers = dateRange.reduce((o, d) => {
      let v = xs[1].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.evaluation_rate) : null, field: "评价率" }
    }, {})
    let bers = dateRange.reduce((o, d) => {
      let v = xs[1].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.bad_evaluation_rate) : null, field: "一二星差评率" }
    }, {})
    let ers_30 = dateRange.reduce((o, d) => {
      let v = xs[2][0]
      return { ...o, [d]: v ? percent(v.evaluation_rate) : null, field: "30天评价率" }
    }, {})
    let fcs = dateRange.reduce((o, d) => {
      let v = xs[3].find(x => x.date == d)
      return { ...o, [d]: v ? v.food_cnt : null, field: "商品数" }
    }, {})
    let ofcs = dateRange.reduce((o, d) => {
      let v = xs[3].find(x => x.date == d)
      return { ...o, [d]: v ? v.off_shelf_cnt : null, field: "下架商品数" }
    }, {})
    return new M({ data: [ratings, ers, bers, ers_30, fcs, ofcs], dates: dateRange })
  }
}

/////////////////////////////
///////////////////////////////////
async function perf(date, djh) {
  try {
    let [data, _] = await knx.raw(perf_sql(date, djh))

    if (!data) return Promise.reject("no data")

    let res = new M(data).bind(sum_).bind(format)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function format(xs) {
    let ys = xs.map(v => ({
      ...v,
      key: `${v.person}-${v.real_shop}-${v.date}`,
      city: empty(v.city),
      person: empty(v.person),
      leader: empty(v.leader),
      real_shop: empty(v.real_shop),
      income_sum: fixed2(v.income_sum),
      income_avg: fixed2(v.income_avg),
      income_score: fixed2(v.income_score),
      cost_sum: fixed2(v.cost_sum),
      cost_avg: fixed2(v.cost_avg),
      cost_sum_ratio: percent(v.cost_sum_ratio),
      cost_sum_sum_ratio: percent(v.cost_sum_sum_ratio),
      cost_score: fixed2(v.cost_score),
      consume_sum: fixed2(v.consume_sum),
      consume_avg: fixed2(v.consume_avg),
      consume_sum_ratio: percent(v.consume_sum_ratio),
      consume_sum_sum_ratio: percent(v.consume_sum_sum_ratio),
      consume_score: fixed2(v.consume_score),
      score: fixed2(v.score),
      income_score_1: fixed2(v.income_score_1),
      cost_score_1: fixed2(v.cost_score_1),
      consume_score_1: fixed2(v.consume_score_1),
      score_1: fixed2(v.score_1),
      income_score_avg: fixed2(v.income_score_avg),
      cost_score_avg: fixed2(v.cost_score_avg),
      consume_score_avg: fixed2(v.consume_score_avg),
      score_avg: fixed2(v.score_avg),
      score_avg_1: fixed2(v.score_avg_1),
    }))
    return new M(ys)
  }

  function sum_(xs) {
    let dates = distinct(xs, "date")
    for (let da of dates) {
      let data = xs.filter(x => x.date == da)
      if (data.length > 0) {
        let persons = distinct(data, "person")
        for (let person of persons) {
          let v = data.find(x => x.person == person)
          xs.push({
            ...v,
            city: "总计",
            person: empty(v.person),
            real_shop: "总计",
            income_sum: v.income_sum_sum,
            income_avg: v.income_avg_avg,
            income_score: v.income_score_avg,
            cost_sum: v.cost_sum_sum,
            cost_avg: v.cost_avg_avg,
            cost_sum_ratio: v.cost_sum_ratio_avg,
            cost_sum_sum_ratio: v.cost_sum_sum_ratio_avg,
            cost_score: v.cost_score_avg,
            consume_sum: v.consume_sum_sum,
            consume_avg: v.consume_avg_avg,
            consume_sum_ratio: v.consume_sum_ratio_avg,
            consume_sum_sum_ratio: v.consume_sum_sum_ratio_avg,
            consume_score: v.consume_score_avg,
            income_score: v.income_score_avg,
            cost_score: v.cost_score_avg,
            consume_score: v.consume_score_avg,
            score: v.score_avg,
            income_score_1: v.income_score_1_avg,
            cost_score_1: v.cost_score_1_avg,
            consume_score_1: v.consume_score_1_avg,
            score_1: v.score_1_avg,
            score_avg: v.score_avg,
            score_avg_1: v.score_avg_1_avg,
            date: da,
          })
        }
        xs.push({
          city: "总计",
          person: "总计",
          real_shop: "总计",
          income_sum: data.reduce((s, v) => s + parseFloat_0(v.income_sum), 0),
          income_avg: data.reduce((s, v) => s + parseFloat_0(v.income_avg), 0) / data.length,
          income_score: data.reduce((s, v) => s + parseFloat_0(v.income_score), 0) / data.length,
          cost_sum: data.reduce((s, v) => s + parseFloat_0(v.cost_sum), 0),
          cost_avg: data.reduce((s, v) => s + parseFloat_0(v.cost_avg), 0) / data.length,
          cost_sum_ratio: data.reduce((s, v) => s + parseFloat_0(v.cost_sum_ratio), 0) / data.length,
          cost_sum_sum_ratio: data.reduce((s, v) => s + parseFloat_0(v.cost_sum_sum_ratio), 0) / data.length,
          cost_score: data.reduce((s, v) => s + parseFloat_0(v.cost_score), 0) / data.length,
          consume_sum: data.reduce((s, v) => s + parseFloat_0(v.consume_sum), 0),
          consume_avg: data.reduce((s, v) => s + parseFloat_0(v.consume_avg), 0) / data.length,
          consume_sum_ratio: data.reduce((s, v) => s + parseFloat_0(v.consume_sum_ratio), 0) / data.length,
          consume_sum_sum_ratio: data.reduce((s, v) => s + parseFloat_0(v.consume_sum_sum_ratio), 0) / data.length,
          consume_score: data.reduce((s, v) => s + parseFloat_0(v.consume_score), 0) / data.length,
          income_score: data.reduce((s, v) => s + parseFloat_0(v.income_score), 0) / data.length,
          cost_score: data.reduce((s, v) => s + parseFloat_0(v.cost_score), 0) / data.length,
          consume_score: data.reduce((s, v) => s + parseFloat_0(v.consume_score), 0) / data.length,
          score: data.reduce((s, v) => s + parseFloat_0(v.score), 0) / data.length,
          income_score_1: data.reduce((s, v) => s + parseFloat_0(v.income_score_1_avg), 0) / data.length,
          cost_score_1: data.reduce((s, v) => s + parseFloat_0(v.cost_score_1_avg), 0) / data.length,
          consume_score_1: data.reduce((s, v) => s + parseFloat_0(v.consume_score_1_avg), 0) / data.length,
          score_1: data.reduce((s, v) => s + parseFloat_0(v.score_1_avg), 0) / data.length,
          score_avg: data.reduce((s, v) => s + parseFloat_0(v.score_avg), 0) / data.length,
          score_avg_1: data.reduce((s, v) => s + parseFloat_0(v.score_avg_1), 0) / data.length,
          date: da,
        })
      }
    }
    // fs.writeFileSync('log/sum.json', JSON.stringify(xs))
    return new M(xs)
  }
}

////////////////////////////////
/////////////////////////
async function commision() {
  try {
    let [data1] = await knx.raw(commision_sql)
    let [data2] = await knx.raw(commision_sql2)

    if (!data1 || !data2) return Promise.reject("no data")

    let data = data1.concat(data2)

    let res = new M(data).bind(format)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function format(xs) {
    let ys = xs.map((v, i) => ({
      ...v,
      key: i,
      级别: empty(v.级别),
      人员: empty(v.人员),
      收入: fixed2(v.收入),
      推广比例: percent(v.推广比例),
      成本比例: percent(v.成本比例),
      利润: fixed2(v.利润),
      提成: fixed2(v.提成),
      月累计提成: fixed2(v.月累计提成),
    }))
    return new M(ys)
  }
}
//////////////////
/////////////////////
//////////////////////////

function ls_against(x) {
  let is_low_income = x.income < (x.platform == "美团" ? 900 : 700)
  let is_high_consume = x.consume_ratio > 0.06 && x.income > 300
  let is_high_cost = x.cost_ratio > 0.53 && x.income > 300
  let is_slump = x.settlea_30 < 0.8
  let ps = []
  if (is_low_income) ps.push({ type: "低收入", value: x.income, threshold: x.platform == "美团" ? 900 : 700 })
  if (is_high_consume) ps.push({ type: "高推广", value: x.consume_ratio, threshold: 0.06 })
  if (is_high_cost) ps.push({ type: "高成本", value: x.cost_ratio, threshold: 0.53 })
  if (is_slump) ps.push({ type: "严重超跌", value: x.settlea_30, threshold: 0.8 })
  return ps
}

async function shop(id) {
  try {
    let data = await knx("test_analyse_t_")
      .select()
      .whereNotNull("a")
      .andWhere({ shop_id: id })

    let res = new M(data)
      .bind(parse_a)
      .bind(extend_qs)
      .bind(format)
      .bind(extract_a)

    return Promise.resolve(res.val)
  } catch (err) {
    return Promise.reject(err)
  }

  function parse_a(xs) {
    let ys = xs.map(v => ({ ...v, a: JSON.parse(v.a) }))
    return new M(ys)
  }

  function extend_qs(xs) {
    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x),
    }))

    return new M(ys)
  }

  function format(xs) {
    let ys = xs.map(x => ({
      ...x,
      a: x.a.map(a => ({
        ...a,
        time_parsed: a.time.trim().length > 0 ? dayjs(a.time.trim(), "YYYY/MM/DD HH:mm:ss") : "",
      })),
    }))

    return new M(formatShop(ys))
  }

  function extract_a(xs) {
    function order(ps) {
      let as = flatten(
        ps.map(x => x.a.filter(a => a.time.trim().length > 0).map(a => ({ ...a, as: x.a, ...omit(x, ["a"]) })))
      )
        .sort((a, b) => {
          if (dayjs(a.time, "YYYY/MM/DD HH:mm:ss").isBefore(dayjs(b.time, "YYYY/MM/DD HH:mm:ss"))) {
            return -1
          } else return 1
        })
        .reverse()
      return as
    }

    let ys = order(xs)
    return new M(ys)
  }
}

/////////////////
///////////////////
//////////////////////////

async function shop_history(id, oneday = false) {
  try {
    let data = await knx("test_analyse_t_")
      .select()
      .where({ shop_id: id })
      .orderBy("date", "desc")

    let res = new M(data)
      .bind(parse_a)
      .bind(extend_qs)
      .bind(format)

    if (!oneday) return Promise.resolve(res.val)
    return Promise.resolve(res.bind(first).val)
  } catch (err) {
    return Promise.reject(err)
  }

  function parse_a(xs) {
    let ys = xs.map(v => ({ ...v, a: v.a ? JSON.parse(v.a) : [] }))
    return new M(ys)
  }

  function extend_qs(xs) {
    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x),
    }))

    return new M(ys)
  }

  function format(xs) {
    let ys = xs.map(x => ({
      ...x,
      a: x.a.map(a => ({
        ...a,
        time_parsed: a.time.trim().length > 0 ? dayjs(a.time.trim(), "YYYY/MM/DD HH:mm:ss") : "",
      })),
    }))

    return new M(formatShop(ys))
  }

  function first(xs) {
    return new M(xs[0])
  }
}

/////////////////
///////////////////
//////////////////////////

async function user(name, d) {
  try {
    const data = await base(d)

    // console.log(name, d, data.shops.filter(v => v.shop_id == 10417267))

    let res = new M(data).bind(distinct_persons)

    if (name == ":all_names") {
      return Promise.resolve(res.val.persons)
    }

    res = res.bind(split_person).bind(object_person)
    if (name == ":all") {
      return Promise.resolve(res.val)
    }

    res = res.bind(filter_person)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function distinct_persons(xs) {
    function ls_persons() {
      let shops_persons = distinct(xs.shops, "person")
      let shops_leaders = distinct(xs.shops, "leader")
      let shop_improved_persons_a = flatten(xs.shop_failure.shop_improved.map(x => distinct(x.a, "name")))
      let shop_improving_persons_a = flatten(xs.shop_failure.shop_improving.map(x => distinct(x.a, "name")))
      return Array.from(
        new Set([...shops_persons, ...shops_leaders, ...shop_improved_persons_a, ...shop_improving_persons_a])
      )
    }

    let persons = ls_persons().filter(v => v != null)

    // console.log(persons)

    return new M({
      ...xs,
      persons,
    })
  }

  function split_person(xs) {
    function order(ps) {
      let as = flatten(
        ps.map(x => x.a.filter(a => a.time.trim().length > 0).map(a => ({ ...a, as: x.a, ...omit(x, ["a"]) })))
      )
        .sort((a, b) => {
          if (dayjs(a.time_parsed).isBefore(dayjs(b.time_parsed))) {
            return -1
          } else return 1
        })
        .reverse()
      return as
    }

    function isLeaderResp(x, person) {
      return x.leader == person && x.qs.find(q => q.type == "低收入")
    }

    function isPersonResp(x, person) {
      return x.person == person && !(x.qs.length == 1 && x.qs[0].type == "低收入")
    }

    let ys = xs.persons
      .map(person => ({
        person,
        responsibles: xs.shops.filter(x => x.person == person),
        success: xs.shop_success.filter(x => x.person == person),
        failure: {
          unimproved: xs.shop_failure.shop_unimproved.filter(x => x.person == person),
          improved: xs.shop_failure.shop_improved.filter(x => x.person == person),
          improving: xs.shop_failure.shop_improving.filter(x => x.person == person),
        },
        participated: [
          ...xs.shop_failure.shop_improved.filter(x => x.a.some(a => a.name == person)),
          ...xs.shop_failure.shop_improving.filter(x => x.a.some(a => a.name == person)),
        ],
      }))
      .map(person => ({
        ...person,
        activities: order(person.participated),
      }))

    return new M(ys)
  }

  function object_person(xs) {
    let ys = xs.reduce((res, per) => {
      return {
        ...res,
        [per.person]: {
          responsibles: per.responsibles,
          success: per.success,
          failure: { ...per.failure },
          activities: per.activities,
          counts: {
            responsibles: count(per.responsibles),
            success: count(per.success),
            failure: {
              unimproved: count(per.failure.unimproved),
              improved: count(per.failure.improved),
              improving: count(per.failure.improving),
            },
            activities: count_activities(per.activities),
          },
        },
      }
    }, {})

    return new M(ys)

    function count(shops) {
      let count_shop = shops.length
      let count_shop_a = shops.filter(x => x.a.length > 0).length

      let count_q = shops.reduce((sum, x) => {
        return sum + x.qs.length //
      }, 0)

      let count_q_without_low_income = shops.reduce((sum, x) => {
        return sum + x.qs.filter(v => v.type != "低收入").length
      }, 0)

      let [count_q_low_income, count_q_high_consume, count_q_high_cost, count_q_slump] = [
        "低收入",
        "高推广",
        "高成本",
        "严重超跌",
      ].map(type => shops.reduce((sum, x) => sum + x.qs.filter(v => v.type == type).length, 0))

      let count_a = shops.reduce((sum, x) => {
        return sum + x.a.filter(a => a.a.trim().length > 0).length //
      }, 0)

      let [count_a_low_income, count_a_high_consume, count_a_high_cost, count_a_slump, count_a_custom] = [
        "低收入",
        "高推广",
        "高成本",
        "严重超跌",
        "自定义",
      ].map(q => shops.reduce((sum, x) => sum + x.a.filter(a => a.q == q && a.a.trim().length > 0).length, 0))

      return {
        count_a,
        count_a_low_income,
        count_a_high_consume,
        count_a_high_cost,
        count_a_slump,
        count_a_custom,
        count_q,
        count_q_without_low_income,
        count_q_low_income,
        count_q_high_consume,
        count_q_high_cost,
        count_q_slump,
        count_shop,
        count_shop_a,
      }
    }

    function count_activities(activities) {
      let count_a = activities.length
      let count_shop = distinct(activities, "shop_id").length
      return { count_a, count_shop }
    }
  }

  function filter_person(xs) {
    return new M(xs[name])
  }
}

//////////////
////////////////
//////////////////

async function user_acts(name, d) {
  try {
    let data = await knx("test_analyse_t_")
      .select()
      .whereNotNull("a")

    let res = new M(data)
      .bind(parse_a)
      .bind(extend_qs)
      .bind(format)
      .bind(distinct_persons)
      .bind(split_person)
      .bind(object_person)
    if (name == ":all") {
      return Promise.resolve(res.val)
    }

    res = res.bind(filter_person)
    if (d != ":all") {
      return Promise.resolve(res.val)
    }

    res = res.bind(filter_time)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function parse_a(xs) {
    let ys = xs.map(v => ({ ...v, a: JSON.parse(v.a) }))
    return new M(ys)
  }

  function extend_qs(xs) {
    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x),
    }))

    return new M(ys)
  }

  function format(xs) {
    function parse(a) {
      let time = ""
      if (a.time.trim().length > 0) {
        // if(a.time.length < )
        time = dayjs(a.time, "YYYY/MM/DD HH:mm:ss")
      }

      return {
        ...a,
        time_parsed: time,
      }
    }

    let ys = xs.map(x => ({ ...x, a: x.a.map(parse) }))

    return new M({
      shops_a: formatShop(ys),
    })
  }

  function distinct_persons(xs) {
    function ls_persons() {
      let persons = flatten(xs.shops_a.map(x => distinct(x.a, "name")))
      return Array.from(new Set(persons))
    }

    let persons = ls_persons()

    return new M({
      ...xs,
      persons,
    })
  }

  function split_person(xs) {
    function order(ps, p) {
      let as = flatten(
        ps.map(x =>
          x.a
            .filter(a => a.time.trim().length > 0 && (d != ":all" ? same(a.time_parsed, d) : true))
            .filter(a => a.name == p)
            .map(a => ({ ...a, as: x.a, ...omit(x, ["a"]) }))
        )
      )
        .sort((a, b) => {
          if (dayjs(a.time, "YYYY/MM/DD HH:mm:ss").isBefore(dayjs(b.time, "YYYY/MM/DD HH:mm:ss"))) {
            return -1
          } else return 1
        })
        .reverse()
      return as

      function same(time_parsed, d) {
        return dayjs()
          .startOf("day")
          .subtract(d, "day")
          .isSame(dayjs(time_parsed).startOf("day"), "day")
      }

      function after(time_parsed, d) {
        return dayjs(time_parsed).isAfter(
          dayjs()
            .startOf("day")
            .subtract(d, "day")
        )
      }
    }

    let ys = xs.persons
      .map(per => ({
        person: per,
        participated: xs.shops_a.filter(x => x.a.some(a => a.name == per)),
      }))
      .map(per => ({
        person: per.person,
        activities: order(per.participated, per.person),
      }))

    return new M(ys)
  }

  function object_person(xs) {
    let ys = xs.reduce((res, per) => {
      return {
        ...res,
        [per.person]: {
          activities: per.activities,
          counts: {
            activities: count_activities(per.activities),
          },
        },
      }
    }, {})

    return new M(ys)

    function count_activities(activities) {
      let count_a = activities.length
      let count_shop = distinct(activities, "shop_id").length
      return { count_a, count_shop }
    }
  }

  function filter_person(xs) {
    return new M(xs[name])
  }

  function filter_time(xs) {
    function ls_times() {
      return Array.from(new Set(xs.activities.map(act => dayjs(act.time_parsed).format("YYYY-MM-DD"))))
    }
    function split_times(times) {
      return times.reduce((o, t) => {
        return {
          ...o,
          [t]: xs.activities
            .filter(act => dayjs(act.time_parsed).format("YYYY-MM-DD") == t)
            .map(act => ({
              q: act.q,
              name: act.name,
              a: act.a,
              operation: act.operation,
              time: act.time,
              time_parsed: act.time_parsed,
              id: act.id,
              shop_id: act.shop_id,
              shop_name: act.shop_name,
              platform: act.platform,
              date: act.date,
            })),
        }
      }, {})
    }
    let ys = split_times(ls_times())
    return new M({ ...xs, activities: ys })
  }
}

///
/////
///////

async function plans(ids, a) {
  try {
    let data = await knx("test_analyse_t_")
      .select()
      .whereIn("id", ids)

    let res = new M(data)
      .bind(parse_a)
      .bind(extend_qs)
      .bind(format)
      .bind(edit_a).val

    let fails = []
    let succs = []
    for (let r of res) {
      try {
        let update_res = await knx("test_analyse_t_")
          .where("id", r.id)
          .update({ a: JSON.stringify(r.a) })
        succs.push(update_res)
      } catch (e) {
        console.log(e)
        fails.push(r.shop_id)
      }
    }

    if (fails.length > 0) return Promise.reject(fails)
    return Promise.resolve(succs)
  } catch (e) {
    return Promise.reject(e)
  }

  function parse_a(xs) {
    let ys = xs.map(v => ({ ...v, a: JSON.parse(v.a) }))
    return new M(ys)
  }

  function extend_qs(xs) {
    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x),
    }))

    return new M(ys)
  }

  function format(xs) {
    function parse(a) {
      let time = ""
      if (a.time.trim().length > 0) {
        // if(a.time.length < )
        time = dayjs(a.time, "YYYY/MM/DD HH:mm:ss")
      }

      return {
        ...a,
        time_parsed: time,
      }
    }

    let ys = xs.map(x => ({ ...x, a: x.a ? x.a.map(parse) : x.a }))

    return new M(formatShop(ys))
  }

  function edit_a(xs) {
    a = JSON.parse(a)
    let ys = xs.map(x => {
      if (x.a.length == 0) {
        return {
          ...x,
          a: x.qs.map(q => ({
            a: a.find(k => k.q == q.type).a || "",
            name: a.find(k => k.q == q.type).name || xs.person,
            operation: a.find(k => k.q == q.type).operation || "save_all",
            q: q.type,
            time: a.find(k => k.q == q.type).time || "",
          })),
        }
      } else {
        return {
          ...x,
          a: x.a.map(v => ({
            a: a.find(k => k.q == v.q).a || v.a,
            name: a.find(k => k.q == v.q).name || v.name,
            operation: a.find(k => k.q == v.q).operation || v.operation,
            q: v.q,
            time: a.find(k => k.q == v.q).time || v.time,
          })),
        }
      }
    })
    return new M(ys)
  }
}

async function comments(id, c) {
  try {
    let update_res = await knx("test_analyse_t_")
      .where("id", id)
      .update({ comments: c })
    return Promise.resolve(update_res)
  } catch (err) {
    return Promise.reject(err)
  }
}

///
/////
///////

async function base(d) {
  try {
    let [data, _] = await knx.raw(date_sql(d))
    if (data.length == 0) {
      // await insertTable(d)
      return Promise.reject("no data")
    }

    const res = new M(data)
      .bind(parse_a)
      .bind(split_shop)
      .bind(split_shop2)
      .bind(format).val
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }

  function parse_a(xs) {
    let ys = xs.map(v => ({ ...v, a: JSON.parse(v.a) }))
    return new M(ys)
  }

  function split_shop(xs) {
    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x),
    }))
    let shop_success = ys.filter(x => x.qs.length == 0)
    let shop_failure = ys.filter(x => x.qs.length > 0)

    return new M({
      shops: ys,
      shop_success,
      shop_failure,
    })
  }

  function split_shop2(xs) {
    function is_improved(a) {
      return a.a.trim().length > 0
    }

    let shop_unimproved = xs.shop_failure.filter(x => x.a == null)
    let shop_improved = xs.shop_failure.filter(x => x.a != null && x.a.every(is_improved))
    let shop_improving = xs.shop_failure.filter(x => x.a != null && !x.a.every(is_improved))

    return new M({
      ...xs,
      shop_failure: {
        shop_unimproved,
        shop_improved,
        shop_improving,
      },
    })
  }

  function format(xs) {
    function parse(a) {
      let time = ""
      if (a.time.trim().length > 0) {
        // if(a.time.length < )
        time = dayjs(a.time, "YYYY/MM/DD HH:mm:ss")
      }

      return {
        ...a,
        time_parsed: time,
      }
    }

    let shop_improved = xs.shop_failure.shop_improved.map(x => ({ ...x, a: x.a.map(parse) }))
    let shop_improving = xs.shop_failure.shop_improving.map(x => ({ ...x, a: x.a.map(parse) }))
    let shops = xs.shops.map(x => {
      let candidate = shop_improved.find(y => y.id == x.id)
      if (candidate) return candidate
      let candidate2 = shop_improving.find(y => y.id == x.id)
      if (candidate2) return candidate2
      return x
    })

    return new M({
      shops: formatShop(shops),
      shop_success: formatShop(xs.shop_success),
      shop_failure: {
        shop_unimproved: formatShop(xs.shop_failure.shop_unimproved),
        shop_improved: formatShop(shop_improved),
        shop_improving: formatShop(shop_improving),
      },
    })
  }
}

async function insertTableFromMysql(day_from_today = 1) {
  let sql = `
  WITH a1 AS (
    SELECT id, real_shop, shop_id, shop_name, platform, 
      (settlea - IFNULL(third_send, 0)) AS income, third_send, orders,
      price AS cost, cost_ratio,
      consume, 
      promotion_rate AS consume_ratio, 
      date 
    FROM foxx_operating_data 
    WHERE date = @last_day
      AND settlea <> 0
  ),
  a2 AS (
    SELECT real_shop, shop_id, shop_name, cost,
      SUM(income) OVER w AS income_sum,
      SUM(cost) OVER w AS cost_sum,
      SUM(consume) OVER w AS consume_sum,
      AVG(income) OVER w AS income_avg,
      AVG(cost) OVER w AS cost_avg,
      AVG(consume) OVER w AS consume_avg,
      SUM(consume) OVER w / SUM(income) OVER w AS consume_sum_ratio,
      SUM(cost) OVER w / SUM(income) OVER w AS cost_sum_ratio
    FROM a1
    WINDOW w as (PARTITION BY real_shop)
  ),
  a3 AS (
    SELECT real_shop, shop_id, shop_name, 
      settlea / AVG(settlea) OVER (w2 ROWS BETWEEN CURRENT ROW AND 29 FOLLOWING) AS settlea_30,
      settlea / LEAD(settlea, 1, 0) OVER w2 - 1 AS settlea_1,
      settlea / LEAD(settlea, 7, 0) OVER w2 - 1 AS settlea_7,
      SUM(settlea) OVER (w2 ROWS BETWEEN  CURRENT ROW AND 2 FOLLOWING) / SUM(settlea) OVER (w2 ROWS BETWEEN 7 FOLLOWING AND 9 FOLLOWING) - 1 AS settlea_7_3,
      date
    FROM foxx_operating_data WHERE date <= @last_day
    WINDOW w2 AS (PARTITION BY shop_id ORDER BY date DESC)
  ),
  a4 AS (
    SELECT * FROM a3 WHERE date = @last_day
  ),
  b1 AS (
    SELECT real_shop, shop_id, shop_name, cost,
      IF(income_avg > 2500, 50, income_avg / 50) AS income_score,
      IF(consume_sum_ratio > 0.065, 0, IF(consume_sum_ratio < 0.04, 15, (0.065 - consume_sum_ratio) * 600)) AS consume_score,
      IF(cost_sum_ratio > 0.54, 0, IF(cost_sum_ratio < 0.44, 35, (0.54 - cost_sum_ratio) * 350)) AS cost_score
    FROM a2
  ),
  b2 AS (
    SELECT real_shop, shop_id, shop_name, income_score, consume_score, cost_score,
      (income_score + consume_score + cost_score) AS score
    FROM b1
  ),
  c1 AS (
    SELECT real_shop_name, shop_id, city, person
    FROM foxx_real_shop_info
  )
  SELECT id, city, person,
    a1.real_shop, a1.shop_id, a1.shop_name, platform, third_send, orders,
    income, income_avg, income_sum,
    a1.cost, cost_avg, cost_sum, cost_ratio, cost_sum_ratio,
    consume, consume_avg, consume_sum, consume_ratio, consume_sum_ratio,
    settlea_30, settlea_1, settlea_7, settlea_7_3, 
    income_score, consume_score, cost_score,
    score,
    a1.date
    
  FROM a1 LEFT JOIN a2 USING(shop_id)
  LEFT JOIN a4 USING (shop_id)
  LEFT JOIN b2 USING (shop_id)
  LEFT JOIN c1 USING (shop_id)
  
  ORDER BY a1.real_shop `

  try {
    console.log(...arguments)
    await knx.raw(`SET @last_day = DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${day_from_today} DAY),'%Y%m%d');`)
    const [data, _] = await knx.raw(sql)
    if (data.length == 0) return Promise.reject("no data")
    const res = await knx("test_analyse_t_").insert(data)
    return Promise.resolve(res)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function insertTable(day_from_today) {
  try {
    const [search, _] = await knx.raw(
      `select * from test_analyse_t_ where date = DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${day_from_today} DAY),'%Y%m%d');`
    )
    if (search.length > 0) return Promise.reject("have been added")
    const res = await insertTableFromMysql(day_from_today)
    return Promise.resolve(res)
  } catch (err) {
    return Promise.reject(err)
  }
}

function formatShop(data) {
  return data.map(v => ({
    ...v,
    city: empty(v.city),
    person: empty(v.person),
    real_shop: empty(v.real_shop),
    shop_id: empty(v.shop_id),
    shop_name: empty(v.shop_name),
    platform: empty(v.platform),
    income: fixed2(v.income),
    income_avg: fixed2(v.income_avg),
    income_sum: fixed2(v.income_sum),
    cost: fixed2(v.cost),
    cost_avg: fixed2(v.cost_avg),
    cost_sum: fixed2(v.cost_sum),
    cost_ratio: percent(v.cost_ratio),
    cost_sum_ratio: percent(v.cost_sum_ratio),
    consume: fixed2(v.consume),
    consume_avg: fixed2(v.consume_avg),
    consume_sum: fixed2(v.consume_sum),
    consume_ratio: percent(v.consume_ratio),
    consume_sum_ratio: percent(v.consume_sum_ratio),
    settlea_30: percent(v.settlea_30),
    settlea_1: percent(v.settlea_1),
    settlea_7: percent(v.settlea_7),
    settlea_7_3: percent(v.settlea_7_3),
    income_score: fixed2(v.income_score),
    cost_score: fixed2(v.cost_score),
    consume_score: fixed2(v.consume_score),
    score: fixed2(v.score),
    a: v.a == null ? [] : v.a,
  }))
}

function distinct(ls, k) {
  return Array.from(new Set(ls.map(v => v[k])))
}

function empty(str) {
  if (str == null) return "-"
  else return str
}

function percent(num) {
  if (num == null) return num
  if (typeof num === "string") num = parseFloat(num)
  return `${(num * 100).toFixed(2)}%`
}

function fixed2(num) {
  if (num == null) return num
  if (typeof num === "string") num = parseFloat(num)
  return num.toFixed(2)
}

function parseFloat_0(num) {
  return parseFloat(num) ? parseFloat(num) : 0
}

function parseFloat_null(num) {
  return parseFloat(num) ? parseFloat(num) : null
}
