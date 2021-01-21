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

router.get('/elm/flow/distribution', async ctx => {
  try {
    const { dates, shop_id } = ctx.query
    if (!dates || !shop_id) {
      ctx.body = { err: 'invalid params' }
      return
    }
    ctx.body = { r: await elm_flow_distribution(dates, shop_id) }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

koa.use(router.routes())

koa.listen(9020, () => console.log('running at 9020'))

async function elm_flow_distribution(dates, shop_id) {
  try {
    const expo_en_map = {
      SEARCH: '搜索',
      CATEGORY: '品类',
      SHOP_LIST: '首页商家列表',
      ORDER_PAGE: '订单页',
      OTHER: '其他入口',
      BIDDING: '竞价推广'
    }
    const flow_type_map = {
      1: '整体流量',
      2: '自然流量',
      3: '广告流量'
    }
    let res = await knx('ele_flow_distribution')
      .select()
      .whereBetween('date', dates.split(','))
      .andWhere({ shop_id })
    res = res.map(v => ({
      ...v,
      flow_type: flow_type_map[v.flow_type],
      exposure_entrance: expo_en_map[v.exposure_entrance] || v.exposure_entrance
    }))
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

// test()
