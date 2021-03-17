import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import flatten from 'flatten'
import fs from 'fs'
import axios from 'axios'
import md5 from 'md5'

import Poi from './fallback/poi.js'
// import { getAllElmShops } from './tools/all.js'
import knex from 'knex'
import { readXls } from './fallback/fallback_app.js'
import { getAllElmShops } from './tools/all.js'

import dayjs from 'dayjs'
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

function omit(obj, ks) {
  let newKs = Object.keys(obj).filter(v => !ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai',
    multipleStatements: true
  }
})

async function t() {
  try {
    const r = await knx('foxx_operating_data')
      .select()
      .where({ date: 20210306 })

    const d = Array.from(new Set(r.map(v => v.shop_name))).map(v => r.find(k => k.shop_name == v))
    await knx('foxx_operating_data')
      .where({ date: 20210306 })
      .del()
    // console.log(d)
    console.log(await knx('foxx_operating_data').insert(d))

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

koa.use(cors())

koa.use(
  bodyParser({
    onerror: function(err, ctx) {
      ctx.throw('body parse error', 422)
    }
  })
)

router.get('/date/:date', async ctx => {})

// multiple dates
router.get('/sum/:date', async ctx => {
  try {
    let { date } = ctx.params
    let { raw } = ctx.query

    if (!date) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await sum(date, raw)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/sum2', async ctx => {
  try {
    const res = await sum2()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/fresh', async ctx => {
  try {
    const res = await fresh()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/perf/:date', async ctx => {
  try {
    let { date } = ctx.params

    if (!date) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await perf(date)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/export/perf', async ctx => {
  try {
    const [res, _] = await knx.raw(perf_sql(31))
    ctx.body = res.map(v => ({ ...v, date: `${v.date}` })).reverse()
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/export/op', async ctx => {
  try {
    const [res, _] = await knx.raw(op_sql(31))
    ctx.body = res.map(v => ({ ...v, shop_id: `${v.shop_id}`, date: `${v.date}` }))
  } catch (e) {
    console.log(e)
    ctx.body = e
  }
})

router.get('/export/op2', async ctx => {
  try {
    const [res, _] = await knx.raw(sum_sql2)
    ctx.body = res.map(v => ({ ...v, ym: `${v.ym}` }))
  } catch (e) {
    console.log(e)
    ctx.body = e
  }
})

router.get('/export/op3', async ctx => {
  try {
    const [res, _] = await knx.raw(sum_sql(31))
    ctx.body = res.map(v => ({
      ...v,
      date: `${v.date}`
    }))
  } catch (e) {
    console.log(e)
    ctx.body = e
  }
})
// all days
router.get('/shop/:shopid', async ctx => {
  try {
    let { shopid } = ctx.params

    if (!shopid) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await shop(shopid)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/shop_history/:shopid', async ctx => {
  try {
    let { shopid } = ctx.params
    let { oneday } = ctx.query
    if (!shopid) {
      ctx.body = { e: 'invalid params' }
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
router.get('/user/:username/:date', async ctx => {
  try {
    let { username, date } = ctx.params
    if (username == '' || !date) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await user(username, date)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/user_acts/:username/:date', async ctx => {
  try {
    let { username, date } = ctx.params
    if (username == '' || !date) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await user_acts(username, date)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/plans', async ctx => {
  try {
    let { ids, a } = ctx.request.body
    if (!ids || !a) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await plans(ids, a)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/comments', async ctx => {
  try {
    let { id, c } = ctx.request.body
    if (!id || !c) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await comments(id, c)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/shops/mt', async ctx => {
  try {
    const res = await new Poi().list()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/shops/elm', async ctx => {
  try {
    const res = await getAllElmShops()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/shops/real', async ctx => {
  try {
    const res = await knx('foxx_real_shop_info').select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/fengniao', async ctx => {
  try {
    const res = await knx('ele_fengniao_info').select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/dada', async ctx => {
  try {
    const res = await knx('dd_login_info').select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/myt', async ctx => {
  try {
    const res = await knx('myt_login_info').select()
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/addNewShop', async ctx => {
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
      rent
    } = ctx.request.body
    if (!platform || !shopId || !shopName || !roomId || !realName) {
      ctx.body = { e: 'invalid params' }
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
      rent
    )
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/addFengniao', async ctx => {
  try {
    let { shopId, shopName, loginName, password } = ctx.request.body
    if (!shopId || !loginName || !password) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await addFengniao(shopId, shopName, loginName, password)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/addDada', async ctx => {
  try {
    let { shopId, shopName, username, password } = ctx.request.body
    if (!shopId || !username || !password) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await addDada(shopId, shopName, username, password)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/addMyt', async ctx => {
  try {
    let { shopId, loginName, password } = ctx.request.body
    if (!shopId || !loginName || !password) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await addMyt(shopId, loginName, password)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/delFengniao', async ctx => {
  try {
    let { shopId, loginName } = ctx.request.body
    if (!shopId || !loginName) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await delFengniao(shopId, loginName)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/delDada', async ctx => {
  try {
    let { shopId, username } = ctx.request.body
    if (!shopId || !username) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await delDada(shopId, username)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/delMyt', async ctx => {
  try {
    let { shopId, loginName } = ctx.request.body
    if (!shopId || !loginName) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await delMyt(shopId, loginName)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/prob/cost/mt/:shopId', async ctx => {
  try {
    let { shopId } = ctx.params
    if (!shopId) {
      ctx.body = { e: 'invalid params' }
      return
    }
    let [data, _] = await knx.raw(美团成本问题(shopId))
    data = data.map((v, i) => ({
      key: i,
      ...v,
      收入: fixed2(v.收入),
      单量占比: percent(v.单量占比),
      成本比例: percent(v.成本比例)
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/prob/cost/elm/:shopId', async ctx => {
  try {
    let { shopId } = ctx.params
    if (!shopId) {
      ctx.body = { e: 'invalid params' }
      return
    }
    let [data, _] = await knx.raw(饿了么成本问题(shopId))

    data = data.map((v, i) => ({
      key: i,
      ...v,
      收入: fixed2(v.收入),
      单量占比: percent(v.单量占比),
      成本比例: percent(v.成本比例),
      单均配送: fixed2(v.单均配送)
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/indices/mt/:shopId/:day', async ctx => {
  try {
    let { shopId, day } = ctx.params
    if (!shopId) {
      ctx.body = { e: 'invalid params' }
      return
    }
    let data = await indices('美团', shopId, day)

    ctx.set('Cache-Control', 'max-age=28800')
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/indices/elm/:shopId/:day', async ctx => {
  try {
    let { shopId, day } = ctx.params
    if (!shopId) {
      ctx.body = { e: 'invalid params' }
      return
    }
    let data = await indices('饿了么', shopId, day)

    ctx.set('Cache-Control', 'max-age=28800')
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/order/mt/:shopId', async ctx => {
  try {
    let { shopId } = ctx.params
    let { activi, counts } = ctx.query
    if (!shopId || !activi || !counts) {
      ctx.body = { e: 'invalid params' }
      return
    }
    let [data, _] = await knx.raw(美团单维度订单(shopId, activi, counts))
    data = data.map((v, i) => ({
      ...v,
      成本比例: percent(v.成本比例),
      订单信息: v.订单信息.replace(/(\*\d+),/gm, '$1\n')
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/order/elm/:shopId', async ctx => {
  try {
    let { shopId } = ctx.params
    let { activi, counts } = ctx.query
    if (!shopId || !activi || !counts) {
      ctx.body = { e: 'invalid params' }
      return
    }
    let [data, _] = await knx.raw(饿了么维度订单(shopId, activi, counts))
    data = data.map((v, i) => ({
      ...v,
      成本比例: percent(v.成本比例),
      单均配送: fixed2(v.单均配送),
      订单信息: v.订单信息.replace(/(\*\d+)\|/gm, '$1\n')
    }))
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/shopActsDiff', async ctx => {
  try {
    let data = await knx('test_change_t_').select()
    data = data.map(v => ({ ...v, after_rule: JSON.parse(v.after_rule), before_rule: JSON.parse(v.before_rule) }))
    if (!data.find(v => dayjs(v.change_date, 'YYYYMMDD').isSame(dayjs(), 'day'))) {
      data = await shopActsDiff()
    }
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/saveShopActsDiff', async ctx => {
  try {
    let { key, handle } = ctx.request.body
    if (!key) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await saveShopActsDiff(key, handle)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/saveFreshA', async ctx => {
  try {
    let { wmPoiId, a2, updated_at } = ctx.request.body
    if (!wmPoiId || !updated_at) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await saveFreshA(wmPoiId, a2, updated_at)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/notes', async ctx => {
  try {
    let data = await knx('test_notes_t_')
      .select()
      .orderBy('updated_at', 'desc')
    ctx.body = { res: data.reverse() }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/saveNote', async ctx => {
  try {
    let { key, title, description, content } = ctx.request.body
    if (!content) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await saveNote(key, title, description, content)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/delNote', async ctx => {
  try {
    let { key } = ctx.request.body
    if (!key) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await delNote(key)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.get('/freshas', async ctx => {
  try {
    let data = await knx('new_shop_track_copy1').select()
    ctx.body = { res: data }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

koa.use(router.routes())

koa.listen(9005, () => console.log('running at 9005'))

const date_sql = d =>
  `SELECT * FROM test_analyse_t_ WHERE date = DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${d} DAY),'%Y%m%d')`

const sum_sql0 = `
  WITH a AS(
    SELECT t.city, t.person, t.real_shop, t.income_sum, t.consume_sum, t.consume_sum_ratio, t.cost_sum, t.cost_sum_ratio, t.date, IFNULL(r.rent / DAY(LAST_DAY(date)), 0) AS rent_cost
    FROM test_analyse_t_ t
    LEFT JOIN foxx_real_shop_info r ON t.real_shop = r.real_shop_name
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
      GREATEST(ROUND(income_sum_15 * 2 / 30000), 5) * 4500 / 30 AS labor_cost,
      income_sum * 0.05 AS water_electr_cost,
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
      SUM(rent_cost) OVER w AS rent_cost_month,
      SUM(labor_cost) OVER w AS labor_cost_month,
      SUM(water_electr_cost) OVER w AS water_electr_cost_month,
      SUM(cashback_cost) OVER w AS cashback_cost_month,
      SUM(oper_cost) OVER w AS oper_cost_month,
      SUM(profit) OVER w AS profit_month
    FROM d
    WINDOW w AS (PARTITION BY real_shop, ym)
  )`

const sum_sql = d =>
  `${sum_sql0}  
  SELECT *, consume_sum_sum / income_sum_sum AS consume_sum_sum_ratio, cost_sum_sum / income_sum_sum AS cost_sum_sum_ratio
  FROM e
  WHERE date >= DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${d} DAY),'%Y%m%d')
  ORDER BY date DESC, income_sum DESC`

const sum_sql2 = `
  ${sum_sql0}
  SELECT city, person, real_shop,income_sum_month, consume_sum_month, consume_sum_ratio_month, cost_sum_month, cost_sum_ratio_month,
  rent_cost_month, labor_cost_month, water_electr_cost_month, cashback_cost_month, oper_cost_month, profit_month, ym 
  FROM e 
  GROUP BY real_shop, ym ORDER BY ym DESC
`

const fresh_sql = `SELECT a.*, e.cost_ratio, IFNULL(b.shop_name, c.reptile_type) AS name, IF(ISNULL(b.shop_name),'美团', '饿了么') AS platform, f.new_person, g.a2
    FROM foxx_new_shop_track a
    LEFT JOIN ele_info_manage b ON a.wmpoiid = b.shop_id 
    LEFT JOIN foxx_shop_reptile c USING(wmpoiid)
    LEFT JOIN foxx_new_shop d ON a.wmpoiid = d.shop_id
    LEFT JOIN foxx_operating_data e ON a.wmpoiid = e.shop_id AND a.date = e.date
    LEFT JOIN foxx_real_shop_info f ON a.wmpoiid = f.shop_id 
    LEFT JOIN new_shop_track_copy1 g ON a.wmpoiid = g.wmpoiid AND g.updated_at = CURDATE()
    WHERE (b.shop_name IS NOT NULL OR c.reptile_type IS NOT NULL)
    AND d.status <> 9 AND DATEDIFF(a.date, d.shop_start_date) BETWEEN 1 AND 30 AND f.new_person IS NOT NULL
    ORDER BY a.wmpoiid, a.date DESC`

const perf_sql = d => `WITH a AS (
    SELECT city, person, real_shop, income_sum, income_avg, income_score, cost_sum, cost_avg, cost_sum_ratio, cost_score, consume_sum, consume_avg, consume_sum_ratio, consume_score, score, date
    FROM test_analyse_t_ 
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
      score - LEAD(score, 1) OVER w2 AS score_1,
      score_avg - LEAD(score_avg, 1) OVER w2 AS score_avg_1
    FROM b2
    WINDOW w2 AS (PARTITION BY real_shop ORDER BY date DESC)
  ),
  c2 AS (
    SELECT *,
      AVG(score_1) OVER w AS score_1_avg,
      AVG(score_avg_1) OVER w AS score_avg_1_avg
    FROM c
    WINDOW w AS (PARTITION BY person, date ORDER BY date DESC)
  )
  SELECT * FROM c2
  WHERE date >= DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${d} DAY),'%Y%m%d')
  ORDER BY date DESC`

const op_sql = d => `SELECT city, person, real_shop, shop_id, shop_name, platform, third_send, unit_price, orders, income, income_avg, income_sum,
  cost, cost_avg, cost_sum, cost_ratio, cost_sum_ratio, 
  consume, consume_avg, consume_sum, consume_ratio, consume_sum_ratio, 
    settlea_30, settlea_1, settlea_7, settlea_7_3, date
  FROM test_analyse_t_ 
  WHERE date >= DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${d} DAY),'%Y%m%d')
  ORDER BY date`

const 美团成本问题 = id => `WITH
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
		date = CURRENT_DATE
-- 		填写id
		AND wmpoiid = ${id}
		AND ( 
			cancel_reason = '' OR
			cancel_reason IS NULL
		)
),
c AS (
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
		insert_date > CURRENT_DATE
-- 		填写id
		AND shop_id = ${id}
),
b AS (
	SELECT 
		wmpoiid,
		shop_name,
		goods_cnt,
		activi,
-- 		a.order_id,
		SUM(cost_sum) cost,
		SUM(settleAmount) settlea,
		count(*) order_cnt
	FROM a JOIN c ON a.order_id = c.order_id
	GROUP BY goods_cnt, activi
)
SELECT 
	wmpoiid,
	shop_name,
	goods_cnt 商品数,
	activi 活动,
	cost 成本,
	settlea 收入,
	order_cnt 单量,
	order_cnt / SUM(order_cnt) OVER()  AS 单量占比,
	cost / settlea AS 成本比例
FROM b
ORDER BY activi, goods_cnt`

const 饿了么成本问题 = id => `WITH a AS (
	SELECT
		shop_id,
		shop_name,
		order_id,
		order_detail,
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
-- 	输入门店id
	  shop_id = ${id} AND
		insert_date > DATE_SUB( CURRENT_DATE, INTERVAL 0 DAY )
),
b AS ( 
SELECT 
	order_id, 
	income,
	CASE
		WHEN activities_fee LIKE '%特价%' THEN
			'折扣'
		ELSE
			'满减'
	END act
FROM ele_order_manag_add WHERE insert_date > DATE_SUB( CURRENT_DATE, INTERVAL 0 DAY ) 
),
c AS (
-- 加入第三方配送费
	SELECT shop_id, third_send / orders AS third_send FROM foxx_operating_data WHERE date = DATE_SUB(CURRENT_DATE,INTERVAL 1 DAY) AND platform = '饿了么'
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
		SUM(income - third_send) OVER(PARTITION BY act, goods_cnt) 收入,
		third_send 单均配送,
		SUM(cost_sum) OVER(PARTITION BY act, goods_cnt) / SUM(income - third_send) OVER(PARTITION BY act, goods_cnt) 成本比例
	FROM 
	a 
		JOIN b 
			ON a.order_id = b.order_id 
		JOIN c 
			ON a.shop_id = c.shop_id
)
SELECT * FROM d GROUP BY 活动, 商品数`

const 美团单维度订单 = (id, activi, counts) => `WITH
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
		date = CURRENT_DATE
		AND wmpoiid = ${id}
		AND ( 
			cancel_reason = '' OR
			cancel_reason IS NULL
		)
),
c AS (
	SELECT 
		order_id, 
		CASE 
		WHEN activi_info LIKE '%现价%' THEN
			'折扣'
		ELSE
			'满减'
		END activi
	FROM foox_order_his WHERE insert_date > CURRENT_DATE AND shop_id = ${id}
),
b AS (
	SELECT 
		wmpoiid,
		shop_name,
		a.order_id 订单id,
		activi 活动,
		goods_count 商品数,
		details 订单信息,
		cost_sum 成本,
		settleAmount 收入,
		cost_sum / settleAmount AS 成本比例
	FROM a JOIN c ON a.order_id = c.order_id
)
SELECT * FROM b 
WHERE 
	活动 = '${activi}' AND
	商品数 = ${counts}
ORDER BY 成本比例 DESC`

const 饿了么维度订单 = (id, activi, counts) => `WITH a AS (
	SELECT
		shop_id,
		shop_name,
		order_id,
		order_detail,
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
	  shop_id = ${id} AND
		insert_date > DATE_SUB( CURRENT_DATE, INTERVAL 0 DAY )
),
b AS ( 
SELECT 
	order_id, 
	income,
	CASE
		WHEN activities_fee LIKE '%特价%' THEN
			'折扣'
		ELSE
			'满减'
	END act
FROM ele_order_manag_add WHERE insert_date > DATE_SUB( CURRENT_DATE, INTERVAL 0 DAY ) 
),
c AS (
-- 加入第三方配送费
	SELECT shop_id, third_send / orders AS third_send FROM foxx_operating_data WHERE date = DATE_SUB(CURRENT_DATE,INTERVAL 1 DAY) AND platform = '饿了么'
)
SELECT 
	a.shop_id,
	a.shop_name, 
	b.act 活动,
	a.goods_cnt 商品数,
	a.order_id 订单id,
	a.order_detail 订单信息,
	b.income 收入,
	a.cost_sum 成本,
	c.third_send 单均配送,
	a.cost_sum / (b.income - c.third_send) 成本比例
FROM a
	JOIN b 
		ON a.order_id = b.order_id 
	JOIN c 
		ON a.shop_id = c.shop_id
WHERE 
	act = '${activi}' AND
	goods_cnt = ${counts}
ORDER BY 成本比例 DESC`

const 线下指标美团评分 = (id, d = 7) => `SELECT 
    -- 评分
    bizscore,
    --  时间统一到数据当天
    DATE_SUB( date, INTERVAL 1 day) date 
    FROM
    foxx_cus_manag_analy_score 
    WHERE 
    -- 查看七天评分
    date >= DATE_SUB( CURRENT_DATE, INTERVAL ${d - 1} DAY) AND
    wmpoiid = ${id}
    ORDER BY date DESC`

const 线下指标饿了么评分 = (id, d = 7) => `SELECT 
    -- 评分
    rating,
    --  时间统一到数据当天
    DATE_FORMAT( DATE_SUB( insert_date, INTERVAL 1 day), "%Y-%m-%d") date
    FROM
    ele_rating_log 
    WHERE 
    -- 查看七天评分
    insert_date > DATE_SUB( CURRENT_DATE, INTERVAL ${d - 1} DAY) AND
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
    count( on_shelf = '下架' OR NULL ) off_shelf_cnt,
    --  第二天早上统计的门店所有产品数量
    count(*) food_cnt,
    DATE_FORMAT(DATE_SUB( insert_date, INTERVAL 1 DAY ), '%Y-%m-%d') date
    FROM ele_food_manage 
    WHERE 
    insert_date > DATE_SUB( CURRENT_DATE, INTERVAL ${d - 1} DAY ) AND
    shop_id = ${id}
    GROUP BY DATE_FORMAT( insert_date, '%Y-%m-%d')
    ORDER BY insert_date DESC`

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

const elm_shop_acts_diff = `SELECT t.shop_id, e.shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.person, 
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
    LEFT JOIN foxx_real_shop_info r USING(shop_id)
    GROUP BY t.shop_id, title, rule
    HAVING COUNT(*) = 1
    ORDER BY t.shop_id, title, insert_date`

const mt_shop_acts_diff = `SELECT t.wmpoiid shop_id, m.reptile_type shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.person, 
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
    LEFT JOIN foxx_real_shop_info r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, name, detail
    HAVING COUNT(*) = 1
    ORDER BY t.wmpoiid, name, date`

const mt_spareas_diff = `SELECT t.wmpoiid shop_id, m.reptile_type shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.person, 
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
    LEFT JOIN foxx_real_shop_info r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, longitude, latitude, logisticsAreas, minPrice, shippingFee
    HAVING COUNT(*) = 1
    ORDER BY t.wmpoiid, longitude, latitude, insert_date`

const elm_spareas_diff = `SELECT t.shop_id, e.shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.person, 
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
    LEFT JOIN foxx_real_shop_info r USING(shop_id)
    GROUP BY t.shop_id, shop_product_desc, price_items, delivery_fee_items
    HAVING COUNT(*) = 1
    ORDER BY t.shop_id, shop_product_desc, insert_date`

const elm_foods_diff = `SELECT t.shop_id, e.shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.person, 
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
    LEFT JOIN foxx_real_shop_info r USING(shop_id)
    GROUP BY t.shop_id, global_id, activity_price, price, package_fee, min_purchase_quantity
    HAVING COUNT(*) = 1
    ORDER BY t.shop_id, global_id, insert_date`

const mt_foods_diff = `SELECT t.wmpoiid shop_id, m.reptile_type shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.person, 
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
    LEFT JOIN foxx_shop_reptile m USING(wmpoiid)
    LEFT JOIN foxx_real_shop_info r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, productId, price, boxPrice
    HAVING COUNT(*) = 1 AND shop_name NOT LIKE '%大计划%'
    ORDER BY t.wmpoiid, productId, insert_date`

const mt_discounts_diff = `SELECT t.wmpoiid shop_id, m.reptile_type shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.person, 
    '折扣商品详情' title, itemName, actInfo, actPrice, orderLimit, manual_sorting, isTop, 
    CONCAT(FROM_UNIXTIME(startTime, '%Y%m%d'), ' 至 ', FROM_UNIXTIME(endTime, '%Y%m%d'))date, DATE_FORMAT(date,'%Y-%m-%d') insert_date
    FROM
    (
    SELECT t1.wmpoiid, t1.itemName, t1.actInfo, t1.actPrice, t1.orderLimit, t1.manual_sorting, t1.isTop, t1.startTime, t1.endTime, t1.date
    FROM foxx_market_activit_my_discounts t1 -- 今天
    WHERE date = CURDATE()
    UNION ALL
    SELECT t2.wmpoiid, t2.itemName, t2.actInfo, t2.actPrice, t2.orderLimit, t2.manual_sorting, t2.isTop, t2.startTime, t2.endTime, t2.date
    FROM foxx_market_activit_my_discounts t2 -- 昨天
    WHERE date = DATE_SUB(CURDATE(),INTERVAL 1 DAY)
    )  t
    LEFT JOIN foxx_shop_reptile m USING(wmpoiid)
    LEFT JOIN foxx_real_shop_info r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, itemName, actPrice, orderLimit
    HAVING COUNT(*) = 1 AND shop_name NOT LIKE '%大计划%'
    ORDER BY t.wmpoiid, itemName, insert_date`

const mt_shop_cate_diff = `SELECT t.wmpoiid shop_id, wmpoiname shop_name, IF(r.platform IS NULL, NULL, IF(r.platform = 1, '美团', '饿了么')) platform, r.person, 
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
    LEFT JOIN foxx_real_shop_info r ON t.wmpoiid = r.shop_id
    GROUP BY t.wmpoiid, mainCategory, supplementCategory
    HAVING COUNT(*) = 1 AND shop_name NOT LIKE '%大计划%'
    ORDER BY t.wmpoiid, mainCategory, supplementCategory, insert_date`

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
  rent
) {
  try {
    roomId = roomId.trim()
    let results = {},
      real_shop_id = ''
    const realShops = await knx('foxx_real_shop_info').select()
    realShops.find(v => v.real_shop_name == realName)
      ? (real_shop_id = realShops.find(v => v.real_shop_name == realName).real_shop_id)
      : (real_shop_id = Math.max(...realShops.map(v => v.real_shop_id)) + 1)

    if (platform == 2) {
      const { ks_id } = await knx(`ele_info_manage`).first('ks_id')
      const res1 = await knx(`ele_info_manage`)
        .insert({ shop_id: shopId, shop_name: shopName, ks_id, status: 0 })
        .onConflict('shop_id')
        .merge()
      results.res1 = res1
    } else if (platform == 1) {
      const res1 = await knx(`foxx_shop_reptile`)
        .insert({ wmpoiid: shopId, reptile_type: shopName, project_id: 10000 })
        .onConflict('wmpoiid')
        .merge()
      results.res1 = res1
    }
    const res2 = await knx(`foxx_message_room`)
      .insert({ wmpoiid: shopId, roomName: shopName, roomId })
      .onConflict('wmpoiid')
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
        rent
      })
      .onConflict('shop_id')
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
        password
      })
      .onConflict('shop_id')
      .merge()
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function addDada(shopId, shopName, username, password) {
  try {
    const { status, content } = await loginDada(username, password)
    if (status != 'ok') return Promise.reject('达达登录失败')
    const { supplierId, accessToken } = content
    const res = await knx(`dd_login_info`)
      .insert({
        shop_id: shopId,
        shop_name: shopName,
        username,
        pw: password,
        user_id: supplierId,
        token: accessToken,
        status: 0
      })
      .onConflict('shop_id')
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
      method: 'post',
      url: 'https://supplier-api.imdada.cn/v1/login',
      headers: {
        'Enable-Gps': '1',
        Accuracy: '550.0',
        Model: 'Android-MI_9',
        'City-Id': '0',
        'User-Token': '1',
        'City-Code': '010',
        'Client-MacAddress': '02:00:00:00:00:02',
        'Rate-Limit-Hash': '2e6e6a654a88fcc8289c162e2c5db0e1',
        'Location-Provider': 'lbs',
        'Channel-ID': 'CPA006',
        Lng: '116.410344',
        'User-Id': '0',
        'App-Version': '8.2.0',
        Operator: 'ChinaMobile',
        'OS-Version': '7.1.2',
        Lat: '39.916295',
        UUID: 'ffffffff-fd1b-7a8d-e826-db5b00000000',
        'Client-Time': '1606389139648',
        'Request-Id': '62f8bfc5-b35f-449c-a6a6-c6724f625a7e',
        Platform: 'Android',
        'App-Name': 'a-shop',
        'Ad-Code': '110101',
        'Sdcard-Id': '219bb10e76f64599b3b10ab8f52f3018',
        'Client-Imei': '865166027515306',
        Network: 'WIFI',
        'Client-Imsi': '460000409278205',
        'Location-Time': '1606389042484',
        'Verification-Hash': md5(data + 'Athens'),
        'Content-Type': 'application/json; charset=UTF-8',
        Host: 'supplier-api.imdada.cn',
        'User-Agent': 'okhttp/3.10.0'
      },
      data: data
    }

    const res = await axios(config)
    return Promise.resolve(res.data)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function addMyt(shopId, loginName, password) {
  try {
    const { message, data } = await loginMyt(loginName, password)
    if (message != '') return Promise.reject(message)
    const { token } = data
    const res = await knx(`myt_login_info`)
      .insert({
        shop_id: shopId,
        login_name: loginName,
        pw: password,
        token
      })
      .onConflict('shop_id')
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
      method: 'post',
      url: 'https://app.saas.maiyatian.com/login/in/',
      headers: {
        Host: 'app.saas.maiyatian.com',
        Cookie: 'PHPSESSID=288581lk05ptplk0704m3bld54',
        origin: 'file://',
        'user-agent':
          'Mozilla/5.0 (Linux; Android 7.1.2; TAS-AN00 Build/N2G48C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36 Html5Plus/1.0 (Immersed/24.0)',
        'content-type': 'application/x-www-form-urlencoded',
        accept: '*/*',
        'accept-language': 'zh-CN,en-US;q=0.9',
        'x-requested-with': 'io.dcloud.maiyatian'
      },
      data: data
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
      knx.raw(elm_foods_diff),
      knx.raw(mt_foods_diff),
      knx.raw(mt_discounts_diff),
      knx.raw(mt_shop_cate_diff)
    ])
    data = data.map(v => v[0])
    data = [
      ...data[0],
      ...data[1],
      ...data[2].map(v => ({
        ...v,
        rule: `面积：${v.logisticsAreas}\n起送价：${v.minPrice}\n配送费：${v.shippingFee}`
      })),
      ...data[3].map(v => ({
        ...v,
        rule: `${v.shop_product_desc}\n起送价：${v.price_items}\n配送费：${v.delivery_fee_items}`
      })),
      ...data[4].map(v => ({
        ...v,
        rule: `${v.category_name}  ${v.on_shelf == '下架' ? '下架' : ''}\n${v.name}\n价格：${v.price} / ${
          v.activity_price
        }\n餐盒费：${v.package_fee}\n最小起购：${v.min_purchase_quantity}`
      })),
      ...data[5].map(v => ({
        ...v,
        rule: `${v.tagName}  ${v.sellStatus == 1 ? '下架' : ''}\n${v.name}\n价格：${v.price / 100}\n餐盒费：${
          v.boxPrice
        }`
      })),
      ...data[6].map(v => ({
        ...v,
        rule: `${v.itemName}\n价格：${v.actInfo} / ${v.actPrice}\n限购：${v.orderLimit}`
      })),
      ...data[7].map(v => ({
        ...v,
        rule: `主营：${v.mainCategory}\n辅营：${v.supplementCategory}`
      }))
    ].sort((a, b) => a.shop_id - b.shop_id)

    let res = new M(data).bind(split)
    let saveRes = await knx('test_change_t_')
      .insert(
        res.val.map(v => ({
          ...v,
          after_rule: JSON.stringify(v.after_rule),
          before_rule: JSON.stringify(v.before_rule)
        }))
      )
      .onConflict('key')
      .merge()
    console.log(saveRes)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function split(xs) {
    let distinct_shop_titles = Array.from(new Set(xs.map(v => `${v.shop_id}|${v.title}`)))
    let ys = distinct_shop_titles.map(shop_title => {
      let shop_id = shop_title.split('|')[0]
      let title = shop_title.split('|')[1]
      let shop_name = xs.find(k => k.shop_id == shop_id)?.shop_name
      let person = xs.find(k => k.shop_id == shop_id)?.person
      let platform = xs.find(k => k.shop_id == shop_id)?.platform
      let after_rule = xs
        .filter(k => k.shop_id == shop_id && k.title == title && dayjs(k.insert_date).isSame(dayjs(), 'day'))
        .map(k => ({ rule: k.rule, date: k.date, insert_date: dayjs(k.insert_date).format('YYYY-MM-DD HH:mm:ss') }))
      let before_rule = xs
        .filter(
          k =>
            k.shop_id == shop_id && k.title == title && dayjs(k.insert_date).isSame(dayjs().subtract(1, 'day'), 'day')
        )
        .map(k => ({ rule: k.rule, date: k.date, insert_date: dayjs(k.insert_date).format('YYYY-MM-DD HH:mm:ss') }))
      return {
        key: `${shop_id}-${title}-${dayjs().format('YYYYMMDD')}`,
        shop_id,
        shop_name,
        platform,
        person,
        title,
        after_rule,
        before_rule,
        change_date: dayjs().format('YYYYMMDD'),
        handle: ''
      }
    })
    return new M(ys)
  }
}

async function saveShopActsDiff(key, handle) {
  try {
    return knx('test_change_t_')
      .where({ key })
      .update({ handle })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function saveFreshA(wmpoiid, a2, updated_at) {
  try {
    return knx('new_shop_track_copy1')
      .insert({
        wmpoiid,
        a2,
        updated_at
      })
      .onConflict(['wmpoiid', 'updated_at'])
      .merge()
  } catch (e) {
    return Promise.reject(e)
  }
}

async function saveNote(key, title, description, content) {
  try {
    return knx('test_notes_t_')
      .insert({
        key,
        title,
        description,
        content,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
      .onConflict('key')
      .merge()
  } catch (e) {
    return Promise.reject(e)
  }
}

async function delNote(key) {
  try {
    return knx('test_notes_t_')
      .where({ key })
      .del()
  } catch (e) {
    return Promise.reject(e)
  }
}

async function ts() {
  try {
    let data = await readXls('plan/Book 1.xlsx', 'Sheet1')
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
      x.date
    ])
    return new M(ys)
  }
}

async function sum(date, raw) {
  let data2 = { shops: [] }
  try {
    let [data, _] = await knx.raw(sum_sql(date))
    // data2 = await sum2()
    if (!data) return Promise.reject('no data')

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
      profit_month: fixed2(v.profit_month)
    }))
    return new M(ys)
  }

  function sum_(xs) {
    let dates = distinct(xs, 'date')
    for (let da of dates) {
      let data = xs.find(v => v.date == da)
      if (data)
        xs.push({
          city: '总计',
          person: '总计',
          real_shop: '总计',
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
          date: da
        })
    }
    return new M({
      xs,
      dates
    })
  }

  function split_shop({ xs, dates }) {
    if (!xs) return []
    let distinct_shops = distinct(xs, 'real_shop')
    let ys = distinct_shops.map(v => {
      let city = xs.find(k => k.real_shop == v).city
      let person = xs.find(k => k.real_shop == v).person
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
      return {
        city,
        person,
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
        ...profits
        // ...profit_months
      }
    })
    return new M({
      dates,
      shops: ys
    })
  }

  function extend({ dates, shops }) {
    let y_shops = shops.map(shop => {
      let d = data2.shops.find(v => v.real_shop == shop.real_shop)
      return {
        ...shop,
        ...d
      }
    })
    return new M({
      dates,
      months: data2.dates,
      shops: y_shops
    })
  }
}

async function sum2() {
  try {
    let [data, _] = await knx.raw(sum_sql2)
    if (!data) return Promise.reject('no data')

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
      profit_month: fixed2(v.profit_month)
    }))
    return new M(ys)
  }

  function sum_(xs) {
    let dates = distinct(xs, 'ym')
    for (let da of dates) {
      let data = xs.find(v => v.ym == da)
      if (data) {
        let income = xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.income_sum_month), 0)
        let consume = xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.consume_sum_month), 0)
        let cost = xs.filter(x => x.ym == da).reduce((s, v) => s + parseFloat_0(v.cost_sum_month), 0)
        xs.push({
          city: '总计',
          person: '总计',
          real_shop: '总计',
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
          ym: da
        })
      }
    }
    // fs.writeFileSync('log/sum.json', JSON.stringify(xs))
    return new M({
      xs,
      dates
    })
  }

  function split_shop({ xs, dates }) {
    if (!xs) return []
    let distinct_shops = distinct(xs, 'real_shop')
    let ys = distinct_shops.map(v => {
      let city = xs.find(k => k.real_shop == v).city
      let person = xs.find(k => k.real_shop == v).person
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
        ...oper_cost_months
      }
    })
    return new M({
      dates,
      shops: ys
    })
  }
}

///////////////////////////
/////////////////////////////
//name field 20210101 20210102
async function fresh() {
  try {
    let [data, _] = await knx.raw(fresh_sql)
    if (!data) return Promise.reject('no data')
    let res = new M(data).bind(format).bind(split_all)

    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function format(xs) {
    let ys = xs.map(v => ({
      ...v,
      name: v.platform == '美团' ? `${v.name}\t${v.platform}` : v.name,
      Entryrate: percent(v.Entryrate),
      Orderrate: percent(v.Orderrate),
      evaluate_over_order: percent(v.evaluate / v.order),
      cost_ratio: percent(v.cost_ratio)
    }))
    return new M(ys)
  }

  function split_all(xs) {
    let names = distinct(xs, 'name')
    let fields = {
      evaluate: '评论数',
      bad_order: '差评数',
      order: '单量',
      evaluate_over_order: '评论/单量',
      bizScore: '评分',
      moment: '推广',
      turnover: '营业额',
      unitPrice: '客单价',
      overview: '曝光量',
      Entryrate: '进店率',
      Orderrate: '下单率',
      cost_ratio: '成本比例',
      off_shelf: '下架产品量',
      over_due_date: '特权有效期',
      kangaroo_name: '袋鼠店长',
      red_packet_recharge: '高拥返现',
      ranknum: '商圈排名',
      extend: '延迟发单',
      a2: '优化'
    }
    let dates = distinct(xs, 'date').sort((a, b) => b - a)
    let ys = names.map(name =>
      Object.keys(fields).map(field => {
        let values = dates.reduce((o, d) => {
          let v = xs.find(x => x.name == name && x.date == d)
          return { ...o, [d]: v ? v[field] : null }
        }, {})
        return {
          key: `${name}-${field}`,
          name,
          wmPoiId: xs.find(x => name.includes(x.name)).wmPoiId,
          new_person: xs.find(x => name.includes(x.name)).new_person,
          field: fields[field],
          ...values
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

    if (platform == '美团') {
      let data = await Promise.all([
        knx.raw(`${线下指标美团评分(shopId, day)}`),
        knx.raw(`${线下指标美团商责配送延迟率(shopId, day)}`),
        knx.raw(`${线下指标美团评价率差评率(shopId, day)}`),
        knx.raw(`${线下指标美团30天评价率(shopId)}`),
        knx.raw(`${线下指标美团30天商责配送延迟率(shopId, day)}`),
        knx.raw(`${线下指标美团商品数下架数(shopId, day)}`),
        knx.raw(`${线下指标美团关店次数(shopId, day)}`)
      ])
      data = data.map(v => v[0])
      let res = new M(data).bind(split)
      return Promise.resolve(res.val)
    } else if (platform == '饿了么') {
      let data = await Promise.all([
        knx.raw(`${线下指标饿了么评分(shopId, day)}`),
        knx.raw(`${线下指标饿了么评价率差评率(shopId, day)}`),
        knx.raw(`${线下指标饿了么30天评价率(shopId)}`),
        knx.raw(`${线下指标饿了么商品数下架数(shopId, day)}`)
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
        .subtract(i + 1, 'day')
        .format('YYYY-MM-DD')
    )

    let ratings = dateRange.reduce((o, d) => {
      let v = xs[0].find(x => x.date == d)
      return { ...o, [d]: v ? v.bizscore : null, field: '评分' }
    }, {})
    let nocs = dateRange.reduce((o, d) => {
      let v = xs[1].find(x => x.date == d)
      return { ...o, [d]: v ? v.negotiable_order_cancellation : null, field: '商责取消数' }
    }, {})
    let ddrs = dateRange.reduce((o, d) => {
      let v = xs[1].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.distribution_delay_rate) : null, field: '配送延迟率' }
    }, {})
    let ers = dateRange.reduce((o, d) => {
      let v = xs[2].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.evaluation_rate) : null, field: '评价率' }
    }, {})
    let bers = dateRange.reduce((o, d) => {
      let v = xs[2].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.bad_evaluation_rate) : null, field: '一二星差评率' }
    }, {})
    let ers_30 = dateRange.reduce((o, d) => {
      let v = xs[3][0]
      return { ...o, [d]: v ? percent(v.evaluation_rate) : null, field: '30天评价率' }
    }, {})
    let nocs_30 = dateRange.reduce((o, d) => {
      let v = xs[4].find(x => x.date == d)
      return { ...o, [d]: v ? v.cancelOfPoiResCnt : null, field: '30天商责取消数' }
    }, {})
    let ddrs_30 = dateRange.reduce((o, d) => {
      let v = xs[4].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.delayRate) : null, field: '30天配送延迟率' }
    }, {})
    let fcs = dateRange.reduce((o, d) => {
      let v = xs[5].find(x => x.date == d)
      return { ...o, [d]: v ? v.food_cnt : null, field: '商品数' }
    }, {})
    let ofcs = dateRange.reduce((o, d) => {
      let v = xs[5].find(x => x.date == d)
      return { ...o, [d]: v ? v.off_shelf_cnt : null, field: '下架商品数' }
    }, {})
    let ocs = dateRange.reduce((o, d) => {
      let v = xs[6].find(x => x.date == d)
      return { ...o, [d]: v ? v.off_count : null, field: '关店数' }
    }, {})
    return new M({ data: [ratings, nocs, ddrs, ers, bers, ers_30, nocs_30, ddrs_30, fcs, ofcs, ocs], dates: dateRange })
  }

  function split_elm(xs) {
    let dateRange = [...Array(day)].map((_, i) =>
      dayjs()
        .subtract(i + 1, 'day')
        .format('YYYY-MM-DD')
    )

    let ratings = dateRange.reduce((o, d) => {
      let v = xs[0].find(x => x.date == d)
      return { ...o, [d]: v ? v.rating : null, field: '评分' }
    }, {})
    let ers = dateRange.reduce((o, d) => {
      let v = xs[1].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.evaluation_rate) : null, field: '评价率' }
    }, {})
    let bers = dateRange.reduce((o, d) => {
      let v = xs[1].find(x => x.date == d)
      return { ...o, [d]: v ? percent(v.bad_evaluation_rate) : null, field: '一二星差评率' }
    }, {})
    let ers_30 = dateRange.reduce((o, d) => {
      let v = xs[2][0]
      return { ...o, [d]: v ? percent(v.evaluation_rate) : null, field: '30天评价率' }
    }, {})
    let fcs = dateRange.reduce((o, d) => {
      let v = xs[3].find(x => x.date == d)
      return { ...o, [d]: v ? v.food_cnt : null, field: '商品数' }
    }, {})
    let ofcs = dateRange.reduce((o, d) => {
      let v = xs[3].find(x => x.date == d)
      return { ...o, [d]: v ? v.off_shelf_cnt : null, field: '下架商品数' }
    }, {})
    return new M({ data: [ratings, ers, bers, ers_30, fcs, ofcs], dates: dateRange })
  }
}

/////////////////////////////
///////////////////////////////////
async function perf(date) {
  try {
    let [data, _] = await knx.raw(perf_sql(date))

    if (!data) return Promise.reject('no data')

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
      score_1: percent(v.score_1),
      score_avg: fixed2(v.score_avg),
      score_avg_1: percent(v.score_avg_1)
    }))
    return new M(ys)
  }

  function sum_(xs) {
    let dates = distinct(xs, 'date')
    for (let da of dates) {
      let data = xs.filter(x => x.date == da)
      if (data.length > 0) {
        let persons = distinct(data, 'person')
        for (let person of persons) {
          let v = data.find(x => x.person == person)
          xs.push({
            ...v,
            city: '总计',
            person: empty(v.person),
            real_shop: '总计',
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
            score: v.score_avg,
            score_1: v.score_1_avg,
            score_avg: v.score_avg,
            score_avg_1: v.score_avg_1_avg,
            date: da
          })
        }
        xs.push({
          city: '总计',
          person: '总计',
          real_shop: '总计',
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
          score: data.reduce((s, v) => s + parseFloat_0(v.score), 0) / data.length,
          score_1: data.reduce((s, v) => s + parseFloat_0(v.score_1_avg), 0) / data.length,
          score_avg: data.reduce((s, v) => s + parseFloat_0(v.score_avg), 0) / data.length,
          score_avg_1: data.reduce((s, v) => s + parseFloat_0(v.score_avg_1), 0) / data.length,
          date: da
        })
      }
    }
    // fs.writeFileSync('log/sum.json', JSON.stringify(xs))
    return new M(xs)
  }
}

//////////////////
/////////////////////
//////////////////////////

async function shop(id) {
  try {
    let data = await knx('test_analyse_t_')
      .select()
      .whereNotNull('a')
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
    function ls_against(x) {
      let is_low_income = x.income < (x.platform == '美团' ? 1500 : 1000) || x.income_avg < 1500
      let is_high_consume = x.consume_ratio > 0.05
      let is_high_cost = x.cost_ratio > 0.5
      let is_slump = x.settlea_30 < 0.7
      let ps = []
      if (is_low_income) ps.push({ type: '低收入', value: x.income, threshold: x.platform == '美团' ? 1500 : 1000 })
      if (is_high_consume) ps.push({ type: '高推广', value: x.consume_ratio, threshold: 0.05 })
      if (is_high_cost) ps.push({ type: '高成本', value: x.cost_ratio, threshold: 0.5 })
      if (is_slump) ps.push({ type: '严重超跌', value: x.settlea_30, threshold: 0.7 })
      return ps
    }

    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x)
    }))

    return new M(ys)
  }

  function format(xs) {
    let ys = xs.map(x => ({
      ...x,
      a: x.a.map(a => ({
        ...a,
        time_parsed: a.time.trim().length > 0 ? dayjs(a.time.trim(), 'YYYY/MM/DD HH:mm:ss') : ''
      }))
    }))

    return new M(formatShop(ys))
  }

  function extract_a(xs) {
    function order(ps) {
      let as = flatten(
        ps.map(x => x.a.filter(a => a.time.trim().length > 0).map(a => ({ ...a, as: x.a, ...omit(x, ['a']) })))
      )
        .sort((a, b) => {
          if (dayjs(a.time, 'YYYY/MM/DD HH:mm:ss').isBefore(dayjs(b.time, 'YYYY/MM/DD HH:mm:ss'))) {
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
    let data = await knx('test_analyse_t_')
      .select()
      .where({ shop_id: id })
      .orderBy('date', 'desc')

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
    function ls_against(x) {
      let is_low_income = x.income < (x.platform == '美团' ? 1500 : 1000) || x.income_avg < 1500
      let is_high_consume = x.consume_ratio > 0.05
      let is_high_cost = x.cost_ratio > 0.5
      let is_slump = x.settlea_30 < 0.7
      let ps = []
      if (is_low_income) ps.push({ type: '低收入', value: x.income, threshold: x.platform == '美团' ? 1500 : 1000 })
      if (is_high_consume) ps.push({ type: '高推广', value: x.consume_ratio, threshold: 0.05 })
      if (is_high_cost) ps.push({ type: '高成本', value: x.cost_ratio, threshold: 0.5 })
      if (is_slump) ps.push({ type: '严重超跌', value: x.settlea_30, threshold: 0.7 })
      return ps
    }

    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x)
    }))

    return new M(ys)
  }

  function format(xs) {
    let ys = xs.map(x => ({
      ...x,
      a: x.a.map(a => ({
        ...a,
        time_parsed: a.time.trim().length > 0 ? dayjs(a.time.trim(), 'YYYY/MM/DD HH:mm:ss') : ''
      }))
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
    let res = new M(data).bind(distinct_persons)

    if (name == ':all_names') {
      return Promise.resolve(res.val.persons)
    }

    res = res.bind(split_person).bind(object_person)
    if (name == ':all') {
      return Promise.resolve(res.val)
    }

    res = res.bind(filter_person)
    return Promise.resolve(res.val)
  } catch (e) {
    return Promise.reject(e)
  }

  function distinct_persons(xs) {
    function ls_persons() {
      let shops_persons = distinct(xs.shops, 'person')
      let shop_improved_persons_a = flatten(xs.shop_failure.shop_improved.map(x => distinct(x.a, 'name')))
      let shop_improving_persons_a = flatten(xs.shop_failure.shop_improving.map(x => distinct(x.a, 'name')))
      return Array.from(new Set([...shops_persons, ...shop_improved_persons_a, ...shop_improving_persons_a]))
    }

    let persons = ls_persons()

    return new M({
      ...xs,
      persons
    })
  }

  function split_person(xs) {
    function order(ps) {
      let as = flatten(
        ps.map(x => x.a.filter(a => a.time.trim().length > 0).map(a => ({ ...a, as: x.a, ...omit(x, ['a']) })))
      )
        .sort((a, b) => {
          if (dayjs(a.time_parsed).isBefore(dayjs(b.time_parsed))) {
            return -1
          } else return 1
        })
        .reverse()
      return as
    }

    let ys = xs.persons
      .map(person => ({
        person,
        responsibles: xs.shops.filter(x => x.person == person),
        success: xs.shop_success.filter(x => x.person == person),
        failure: {
          unimproved: xs.shop_failure.shop_unimproved.filter(x => x.person == person),
          improved: xs.shop_failure.shop_improved.filter(x => x.person == person),
          improving: xs.shop_failure.shop_improving.filter(x => x.person == person)
        },
        participated: [
          ...xs.shop_failure.shop_improved.filter(x => x.a.some(a => a.name == person)),
          ...xs.shop_failure.shop_improving.filter(x => x.a.some(a => a.name == person))
        ]
      }))
      .map(person => ({
        ...person,
        activities: order(person.participated)
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
              improving: count(per.failure.improving)
            },
            activities: count_activities(per.activities)
          }
        }
      }
    }, {})

    return new M(ys)

    function count(shops) {
      let count_shop = shops.length
      let count_shop_a = shops.filter(x => x.a.length > 0).length
      let count_q = shops.reduce((sum, x) => {
        return sum + x.qs.length
      }, 0)
      let count_a = shops.reduce((sum, x) => {
        return sum + x.a.filter(a => a.a.trim().length > 0).length
      }, 0)
      return {
        count_a,
        count_q,
        count_shop,
        count_shop_a
      }
    }

    function count_activities(activities) {
      let count_a = activities.length
      let count_shop = distinct(activities, 'shop_id').length
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
    let data = await knx('test_analyse_t_')
      .select()
      .whereNotNull('a')

    let res = new M(data)
      .bind(parse_a)
      .bind(extend_qs)
      .bind(format)
      .bind(distinct_persons)
      .bind(split_person)
      .bind(object_person)
    if (name == ':all') {
      return Promise.resolve(res.val)
    }

    res = res.bind(filter_person)
    if (d != ':all') {
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
    function ls_against(x) {
      let is_low_income = x.income < (x.platform == '美团' ? 1500 : 1000) || x.income_avg < 1500
      let is_high_consume = x.consume_ratio > 0.05
      let is_high_cost = x.cost_ratio > 0.5
      let is_slump = x.settlea_30 < 0.7
      let ps = []
      if (is_low_income) ps.push({ type: '低收入', value: x.income, threshold: x.platform == '美团' ? 1500 : 1000 })
      if (is_high_consume) ps.push({ type: '高推广', value: x.consume_ratio, threshold: 0.05 })
      if (is_high_cost) ps.push({ type: '高成本', value: x.cost_ratio, threshold: 0.5 })
      if (is_slump) ps.push({ type: '严重超跌', value: x.settlea_30, threshold: 0.7 })
      return ps
    }

    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x)
    }))

    return new M(ys)
  }

  function format(xs) {
    function parse(a) {
      let time = ''
      if (a.time.trim().length > 0) {
        // if(a.time.length < )
        time = dayjs(a.time, 'YYYY/MM/DD HH:mm:ss')
      }

      return {
        ...a,
        time_parsed: time
      }
    }

    let ys = xs.map(x => ({ ...x, a: x.a.map(parse) }))

    return new M({
      shops_a: formatShop(ys)
    })
  }

  function distinct_persons(xs) {
    function ls_persons() {
      let persons = flatten(xs.shops_a.map(x => distinct(x.a, 'name')))
      return Array.from(new Set(persons))
    }

    let persons = ls_persons()

    return new M({
      ...xs,
      persons
    })
  }

  function split_person(xs) {
    function order(ps, p) {
      let as = flatten(
        ps.map(x =>
          x.a
            .filter(a => a.time.trim().length > 0 && (d != ':all' ? same(a.time_parsed, d) : true))
            .filter(a => a.name == p)
            .map(a => ({ ...a, as: x.a, ...omit(x, ['a']) }))
        )
      )
        .sort((a, b) => {
          if (dayjs(a.time, 'YYYY/MM/DD HH:mm:ss').isBefore(dayjs(b.time, 'YYYY/MM/DD HH:mm:ss'))) {
            return -1
          } else return 1
        })
        .reverse()
      return as

      function same(time_parsed, d) {
        return dayjs()
          .startOf('day')
          .subtract(d, 'day')
          .isSame(dayjs(time_parsed).startOf('day'), 'day')
      }

      function after(time_parsed, d) {
        return dayjs(time_parsed).isAfter(
          dayjs()
            .startOf('day')
            .subtract(d, 'day')
        )
      }
    }

    let ys = xs.persons
      .map(per => ({
        person: per,
        participated: xs.shops_a.filter(x => x.a.some(a => a.name == per))
      }))
      .map(per => ({
        person: per.person,
        activities: order(per.participated, per.person)
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
            activities: count_activities(per.activities)
          }
        }
      }
    }, {})

    return new M(ys)

    function count_activities(activities) {
      let count_a = activities.length
      let count_shop = distinct(activities, 'shop_id').length
      return { count_a, count_shop }
    }
  }

  function filter_person(xs) {
    return new M(xs[name])
  }

  function filter_time(xs) {
    function ls_times() {
      return Array.from(new Set(xs.activities.map(act => dayjs(act.time_parsed).format('YYYY-MM-DD'))))
    }
    function split_times(times) {
      return times.reduce((o, t) => {
        return {
          ...o,
          [t]: xs.activities
            .filter(act => dayjs(act.time_parsed).format('YYYY-MM-DD') == t)
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
              date: act.date
            }))
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
    let data = await knx('test_analyse_t_')
      .select()
      .whereIn('id', ids)

    let res = new M(data)
      .bind(parse_a)
      .bind(extend_qs)
      .bind(format)
      .bind(edit_a).val

    let fails = []
    let succs = []
    for (let r of res) {
      try {
        let update_res = await knx('test_analyse_t_')
          .where('id', r.id)
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
    function ls_against(x) {
      let is_low_income = x.income < (x.platform == '美团' ? 1500 : 1000) || x.income_avg < 1500
      let is_high_consume = x.consume_ratio > 0.05
      let is_high_cost = x.cost_ratio > 0.5
      let is_slump = x.settlea_30 < 0.7
      let ps = []
      if (is_low_income) ps.push({ type: '低收入', value: x.income, threshold: x.platform == '美团' ? 1500 : 1000 })
      if (is_high_consume) ps.push({ type: '高推广', value: x.consume_ratio, threshold: 0.05 })
      if (is_high_cost) ps.push({ type: '高成本', value: x.cost_ratio, threshold: 0.5 })
      if (is_slump) ps.push({ type: '严重超跌', value: x.settlea_30, threshold: 0.7 })
      return ps
    }

    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x)
    }))

    return new M(ys)
  }

  function format(xs) {
    function parse(a) {
      let time = ''
      if (a.time.trim().length > 0) {
        // if(a.time.length < )
        time = dayjs(a.time, 'YYYY/MM/DD HH:mm:ss')
      }

      return {
        ...a,
        time_parsed: time
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
            a: a.find(k => k.q == q.type).a || '',
            name: a.find(k => k.q == q.type).name || xs.person,
            operation: a.find(k => k.q == q.type).operation || 'save_all',
            q: q.type,
            time: a.find(k => k.q == q.type).time || ''
          }))
        }
      } else {
        return {
          ...x,
          a: x.a.map(v => ({
            a: a.find(k => k.q == v.q).a || v.a,
            name: a.find(k => k.q == v.q).name || v.name,
            operation: a.find(k => k.q == v.q).operation || v.operation,
            q: v.q,
            time: a.find(k => k.q == v.q).time || v.time
          }))
        }
      }
    })
    return new M(ys)
  }
}

async function comments(id, c) {
  try {
    let update_res = await knx('test_analyse_t_')
      .where('id', id)
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
      return Promise.reject('no data')
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
    function ls_against(x) {
      let is_low_income = x.income < (x.platform == '美团' ? 1500 : 1000) || x.income_avg < 1500
      let is_high_consume = x.consume_ratio > 0.05
      let is_high_cost = x.cost_ratio > 0.5
      let is_slump = x.settlea_30 < 0.7
      let ps = []
      if (is_low_income) ps.push({ type: '低收入', value: x.income, threshold: x.platform == '美团' ? 1500 : 1000 })
      if (is_high_consume) ps.push({ type: '高推广', value: x.consume_ratio, threshold: 0.05 })
      if (is_high_cost) ps.push({ type: '高成本', value: x.cost_ratio, threshold: 0.5 })
      if (is_slump) ps.push({ type: '严重超跌', value: x.settlea_30, threshold: 0.7 })
      return ps
    }

    let ys = xs.map(x => ({
      ...x,
      qs: ls_against(x)
    }))
    let shop_success = ys.filter(x => x.qs.length == 0)
    let shop_failure = ys.filter(x => x.qs.length > 0)

    return new M({
      shops: ys,
      shop_success,
      shop_failure
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
        shop_improving
      }
    })
  }

  function format(xs) {
    function parse(a) {
      let time = ''
      if (a.time.trim().length > 0) {
        // if(a.time.length < )
        time = dayjs(a.time, 'YYYY/MM/DD HH:mm:ss')
      }

      return {
        ...a,
        time_parsed: time
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
        shop_improving: formatShop(shop_improving)
      }
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
    if (data.length == 0) return Promise.reject('no data')
    const res = await knx('test_analyse_t_').insert(data)
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
    if (search.length > 0) return Promise.reject('have been added')
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
    a: v.a == null ? [] : v.a
  }))
}

function distinct(ls, k) {
  return Array.from(new Set(ls.map(v => v[k])))
}

function empty(str) {
  if (str == null) return '-'
  else return str
}

function percent(num) {
  if (num == null) return num
  if (typeof num === 'string') num = parseFloat(num)
  return `${(num * 100).toFixed(2)}%`
}

function fixed2(num) {
  if (typeof num === 'string') num = parseFloat(num)
  return num.toFixed(2)
}

function parseFloat_0(num) {
  return parseFloat(num) ? parseFloat(num) : 0
}
