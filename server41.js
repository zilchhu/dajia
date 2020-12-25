import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import flatten from 'flatten'

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
router.get('/user/:username', async ctx => {
  try {
    const res = await user()
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

async function user(name) {
  try {
    const data = await base(1)
    const res = new M(data).bind(distinct_persons).bind(split_person).val
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }

  function distinct_persons(xs) {
    function distinct(ls, k) {
      return Array.from(new Set(ls.map(v => v[k])))
    }
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
    let ys = xs.persons.map(person => ({
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

    return new M(ys)
  }
}

async function base(d) {
  try {
    const [date_data, _] = await knx.raw(date_sql(d))
    if (date_data.length == 0) return Promise.reject('no date_data')
    const res = new M(date_data)
      .bind(parse_a)
      .bind(split_shop)
      .bind(split_shop2).val
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
      q: ls_against(x)
    }))
    let shop_success = ys.filter(x => x.q.length == 0)
    let shop_failure = ys.filter(x => x.q.length > 0)

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
}
