import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'

import knex from 'knex'
const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai'
  }
})

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

router.get('/table', async ctx => {
  try {
    let { day_from_today, shop_id, interval } = JSON.parse(JSON.stringify(ctx.query))
    if (!interval) {
      const data = await getTableFromMysql(day_from_today, shop_id)
      ctx.body = { err: null, data }
    } else {
      day_from_today = parseInt(day_from_today)
      interval = parseInt(interval)
      const data = await getHistoryTableFromMysql(day_from_today, shop_id, interval)
      ctx.body = { err: null, data }
    }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})

router.get('/rules', async ctx => {
  try {
    const data = await getRules()
    ctx.body = { err: null, data }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})

router.post('/plan', async ctx => {
  try {
    const { oid, name, q, a } = ctx.request.body
    const data = await postPlan(oid, name, q, a)
    ctx.body = { err: null, data }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})

router.get('/plans', async ctx => {
  try {
    const data = await getPlans()
    ctx.body = { err: null, data }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})


router.get('/plan/:shop_id', async ctx => {
  try {
    const { shop_id } = ctx.params
    const data = await getPlans(shop_id)
    ctx.body = { err: null, data }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})

koa.use(router.routes())

koa.listen(9004, () => console.log('running at 9004'))

async function getTableFromMysql(day_from_today = 1, shop_id) {
  let where_shop = shop_id ? `WHERE shop_id = ${shop_id}` : ''
  let sql = `
  WITH a1 AS (
    SELECT id, real_shop, shop_id, shop_name, platform, 
      (settlea - third_send) AS income, third_send,
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
  ),
  d1 AS (
    SELECT id AS op_id, oid, name AS op_name, q, a, created_at AS op_time
    FROM test_analyse_a_
  )
  SELECT id, city, person,
    a1.real_shop, a1.shop_id, a1.shop_name, platform, third_send,
    income, income_avg, income_sum,
    a1.cost, cost_avg, cost_sum, cost_ratio, cost_sum_ratio,
    consume, consume_avg, consume_sum, consume_ratio, consume_sum_ratio,
    settlea_30, settlea_1, settlea_7, settlea_7_3, 
    income_score, consume_score, cost_score,
    score,
    a1.date,
    op_id, op_name, q, a, op_time
    
  FROM a1 LEFT JOIN a2 USING(shop_id)
  LEFT JOIN a4 USING (shop_id)
  LEFT JOIN b2 USING (shop_id)
  LEFT JOIN c1 USING (shop_id)
  LEFT JOIN d1 ON a1.id = d1.oid
  
  ${where_shop}
  ORDER BY a1.real_shop `

  try {
    console.log(...arguments)
    await knx.raw(`SET @last_day = CURDATE() - ${day_from_today}`)
    const [data, _] = await knx.raw(sql)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function getHistoryTableFromMysql(day_from_today, shop_id, interval = 7) {
  let histories = []
  try {
    let start = day_from_today
    while (start < day_from_today + interval) {
      let [data, _] = await getTableFromMysql(start, shop_id)
      if (!data) return Promise.resolve(histories)
      histories.push(data)
      start = start + 1
    }
    return Promise.resolve(histories)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function getRules() {
  try {
    const data = await knx('test_analyse_rule_').select()
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function postPlan(oid, name, q, a) {
  try {
    if (!oid || !name || !q || !a) return Promise.reject('param is invalid')
    if (name.length < 2 || name.length > 10) return Promise.reject('param is invalid')
    if (q.length < 1 || a.length < 1) return Promise.reject('param is invalid')

    const data = await knx('test_analyse_a_').insert({ oid, name, q, a })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function getPlans(shop_id) {
  try {
    if (!shop_id) {
      const data = await knx('test_analyse_a_').select()
      return Promise.resolve(data)
    } else {
      const op_data = await knx('foxx_operating_data')
        .select()
        .where({ shop_id })
      const data = await knx('test_analyse_a_')
        .select()
        .whereIn(
          'oid',
          op_data.map(v => v.id)
        )
      return Promise.resolve(data)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
