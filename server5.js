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
    database: 'naicai',
    multipleStatements: true
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

router.post('/custom', async ctx => {
  try {
    let { sql } = ctx.request.body
    console.log(sql)
    if (!sql || sql.toLowerCase().includes('delete')) {
      ctx.body = { err: 'invalid params' }
      return
    }
    ctx.body = await custom(sql)
  } catch (e) {
    ctx.body = { e }
  }
})

router.post('/customs', async ctx => {
  try {
    let { sqls } = ctx.request.body
    if (!sqls || sqls.some(v => v.toLowerCase().includes('delete'))) {
      ctx.body = { err: 'invalid params' }
      return
    }
    ctx.body = await customs(sqls)
  } catch (e) {
    ctx.body = { e }
  }
})

router.post('/customs2', async ctx => {
  try {
    let { sqls } = ctx.request.body
    if (!sqls || sqls.some(v => v.sql.toLowerCase().includes('delete'))) {
      ctx.body = { err: 'invalid params' }
      return
    }
    ctx.body = await customs2(sqls)
  } catch (e) {
    ctx.body = { e }
  }
})

router.get('/shops/real', async ctx => {
  try {
    ctx.body = await realShops()
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.get('/shops', async ctx => {
  try {
    ctx.body = await shops()
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.get('/charts', async ctx => {
  try {
    ctx.body = await charts()
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.get('/menus', async ctx => {
  try {
    ctx.body = await menus()
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.get('/charts/layouts', async ctx => {
  try {
    ctx.body = await knx('test_chart_layout_').select()
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post('/charts/layout/update', async ctx => {
  try {
    let { ids, id, rect } = ctx.request.body
    if (!ids || id == null || !rect) {
      ctx.body = { e: 'invalid' }
      return
    }
    ctx.body = await knx('test_chart_layout_')
      .insert({ ids, id, rect })
      .onConflict(['ids', 'id'])
      .merge()
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post('/chart/add', async ctx => {
  try {
    let { chart } = ctx.request.body
    if (!chart) {
      ctx.body = { err: 'invalid params' }
      return
    }
    ctx.body = await addChart(chart)
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post('/chart/update', async ctx => {
  try {
    let { id, chart } = ctx.request.body
    console.log(ctx.request.body)
    if (id == null || id == undefined || !chart) {
      ctx.body = { err: 'invalid params' }
      return
    }
    ctx.body = await updateChart(id, chart)
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post('/menu/update', async ctx => {
  try {
    let { menu } = ctx.request.body

    if (menu == null || menu == undefined) {
      ctx.body = { err: 'invalid params' }
      return
    }
    ctx.body = await updateMenus(menu)
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

async function custom(sql) {
  try {
    const [data, _] = await knx.raw(sql)
    return Promise.resolve(data)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function customs(sqls) {
  try {
    let [data, _] = await knx.raw(sqls.join(';'))
    // data = data.map(v => v[0])
    return Promise.resolve(data)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function customs2(sqls) {
  try {
    let results2 = await Promise.all(sqls.map(sql => knx.raw(sql.sql)))
    results2 = results2.map(v => v[0])
    results2 = sqls.map((sql, i) => ({ id: sql.id, data: results2[i] }))

    // for (let sql of sqls) {
    //   try {
    //     let [data, _] = await knx.raw(sql.sql)
    //     results.push({ id: sql.id, data })
    //   } catch (e) {
    //     return Promise.reject(e)
    //   }
    // }
    return Promise.resolve(results2)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function shops() {
  try {
    const elms = await knx('ele_info_manage').select()
    const mts = await knx('foxx_shop_reptile').select()
    return Promise.resolve([
      ...mts.map(v => ({ platform: '美团', shopId: v.wmpoiid, shopName: v.reptile_type })),
      ...elms.map(v => ({ platform: '饿了么', shopId: v.shop_id, shopName: v.shop_name }))
    ])
  } catch (e) {
    return Promise.reject(e)
  }
}

async function realShops() {
  try {
    return knx('foxx_real_shop_info').distinct('real_shop_name')
  } catch (e) {
    return Promise.reject(e)
  }
}

async function charts() {
  try {
    const charts = await knx('test_chart_').select()
    return Promise.resolve(charts)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function menus() {
  try {
    const menu = await knx('test_chart_menu_').first('menu')
    return Promise.resolve(menu)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function updateMenus(menu) {
  try {
    const res = await knx('test_chart_menu_').update({ menu })
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function addChart(chart) {
  try {
    const res = await knx('test_chart_').insert(chart, ['id'])
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function updateChart(id, chart) {
  try {
    const res = await knx('test_chart_')
      .where({ id })
      .update(chart)
    return Promise.resolve(res)
  } catch (e) {
    return Promise.reject(e)
  }
}
// test()
