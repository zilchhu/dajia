import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import fs from 'fs'
import bcrypt from 'bcrypt'

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

router.get('/tableByDate/:day', async ctx => {
  try {
    let { day } = ctx.params
    if (!day) {
      ctx.body = { err: 'invalid params' }
      return
    }
    const data = await getTableByDate(day)
    ctx.body = { data }
  } catch (err) {
    console.error(err)
    ctx.body = { err }
  }
})

router.get('/tableByShop/:shopId', async ctx => {
  try {
    let { shopId } = ctx.params
    if (!shopId) {
      ctx.body = { err: 'invalid params' }
      return
    }
    const data = await getTableByShop(shopId)
    ctx.body = { data }
  } catch (err) {
    console.error(err)
    ctx.body = { err }
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
    const { id, a } = ctx.request.body
    if (!id || !a) {
      ctx.body = { err: 'invalid params' }
      return
    }
    const data = await updateTable(id, a)
    ctx.body = { err: null, data }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})

koa.use(router.routes())

// koa.listen(9004, () => console.log('running at 9004'))

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

async function updateTable(id, a) {
  try {
    const res = await knx('test_analyse_t_')
      .where('id', id)
      .update({ a })
    return Promise.resolve(res)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateTableAll() {
  const data = await knx('foxx_operating_data')
    .select()
    .where({
      date: 20201224
    })
  let cnt = data.length
  for (let rec of data) {
    console.log(cnt)
    try {
      let res = await knx('test_analyse_t_')
        .where('id', rec.id)
        .update({ orders: rec.orders })
      console.log(rec.id, res)
    } catch (error) {
      console.error(error)
      fs.appendFileSync('log.error', rec.id + '\n')
    }
    cnt -= 1
  }
}

async function updateTableAll2() {
  try {
    const data = await knx('test_analyse_t_')
      .select()
      .whereNotNull('a')
      .orderBy('date')
    let cnt = data.length
    for (let rec of data) {
      console.log(cnt)
      try {
        let a = JSON.parse(rec.a).map(v => {
          let time = v.time.trim()
          if (v.time.trim().length > 0 && v.time.startsWith('12')) time = `2020/${v.time}`
          return {
            ...v,
            time
          }
        })
        const res = await updateTable(rec.id, JSON.stringify(a))
        console.log({ a, res })
      } catch (err) {
        console.error(err)
      }
      cnt -= 1
    }
  } catch (error) {
    console.error(error)
  }
}

updateTableAll2()

async function getTableByDate(day_from_today) {
  try {
    let sql = `SELECT * FROM test_analyse_t_ WHERE date = DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${day_from_today} DAY),'%Y%m%d')`
    let [data, _] = await knx.raw(sql)
    if (data.length == 0) {
      await insertTable(day_from_today)
      let [data, _] = await knx.raw(sql)
      return Promise.resolve(formatTable(data))
    }
    return Promise.resolve(formatTable(data))
  } catch (err) {
    return Promise.reject(err)
  }
}

async function getTableByShop(shop_id) {
  try {
    let sql = `SELECT * FROM test_analyse_t_ WHERE shop_id = ${shop_id} AND date < DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL 1 DAY),'%Y%m%d') ORDER BY date DESC`
    const [data, _] = await knx.raw(sql)
    return Promise.resolve(formatTable(data))
  } catch (err) {
    return Promise.reject(err)
  }
}

async function insertTableAll() {
  for (let day = 1; day <= 94; day++) {
    try {
      console.log(day)
      const res = await insertTable(day)
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }
}

// insertTableAll()

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

function percent(num) {
  if (typeof num === 'string') num = parseFloat(num)
  return `${(num * 100).toFixed(2)}%`
}

function fixed2(num) {
  if (typeof num === 'string') num = parseFloat(num)
  return num.toFixed(2)
}

function empty(str) {
  if (str == null) return ''
  else return str
}

function formatTable(data) {
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
    score: fixed2(v.score)
  }))
}
