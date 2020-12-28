import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import flatten from 'flatten'
import dayjs from 'dayjs'

function omit(obj, ks) {
  let newKs = Object.keys(obj).filter(v => !ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

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
// all days
router.get('/shop/:shopid', async ctx => {})
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

koa.use(router.routes())

koa.listen(9005, () => console.log('running at 9005'))

const date_sql = d =>
  `SELECT * FROM test_analyse_t_ WHERE date = DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${d} DAY),'%Y%m%d')`
const shop_sql = id => `SELECT * FROM test_analyse_t_ WHERE shop_id = ${id} ORDER BY date DESC`

async function date(d) {}

async function shop(id) {}

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
    function order(ps) {
      let as = flatten(
        ps.map(x =>
          x.a
            .filter(
              a =>
                a.time.trim().length > 0 &&
                dayjs(a.time_parsed).isAfter(
                  dayjs()
                    .startOf('day')
                    .subtract(d, 'day')
                )
            )
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
    }

    let ys = xs.persons
      .map(per => ({
        person: per,
        participated: xs.shops_a.filter(x => x.a.some(a => a.name == per))
      }))
      .map(per => ({
        person: per.person,
        activities: order(per.participated)
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
}

///
/////
///////

async function base(d) {
  try {
    let [data, _] = await knx.raw(date_sql(d))
    if (data.length == 0) {
      await insertTable(d)
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

  function empty(str) {
    if (str == null) return '-'
    else return str
  }

  function percent(num) {
    if (typeof num === 'string') num = parseFloat(num)
    return `${(num * 100).toFixed(2)}%`
  }

  function fixed2(num) {
    if (typeof num === 'string') num = parseFloat(num)
    return num.toFixed(2)
  }
}

function distinct(ls, k) {
  return Array.from(new Set(ls.map(v => v[k])))
}
