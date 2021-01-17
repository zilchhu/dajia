import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import fs, { promises } from 'fs'
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

router.get('/allTableInfos', async ctx => {
  try {
    ctx.body = { r: await getAllTableInfos() }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

router.post('/chart', async ctx => {
  try {
    const { tableName, x, ys, conds } = ctx.request.body
    if (!tableName || !x || !ys) {
      ctx.body = { err: 'invalid params' }
      return
    }
    ctx.body = { r: await getChart(tableName, x, ys, conds) }
  } catch (e) {
    console.error(e)
    ctx.body = { e }
  }
})

koa.use(router.routes())

koa.listen(9020, () => console.log('running at 9020'))

async function getAllTableInfos() {
  try {
    const [r1, _] = await knx.raw('show tables')
    return Promise.all(r1.map(v => knx.raw(`SHOW CREATE TABLE ${v.Tables_in_naicai}`).then(k => k[0])))
  } catch (e) {
    return Promise.reject(e)
  }
}

async function getChart(tableName, x, ys, conds = []) {
  function addWhere(q) {
    if (conds.length == 0) return q
    if (conds.length == 1) return q.where(conds[0].field, conds[0].op, conds[0].cond)
    if (conds.length > 1)
      return conds.slice(1).reduce((s, v) => {
        return s.andWhere(v.field, v.op, v.cond)
      }, q.where(conds[0].field, conds[0].op, conds[0].cond))
  }

  try {
    let xQ = addWhere(knx(tableName).select([x.field]))
    let xD = await xQ

    let xAxis = [
      {
        type: 'category',
        boundaryGap: true,
        data: xD.map(v => v[x.field])
      }
    ]

    let yQ = addWhere(knx(tableName).select(ys.map(y => y.field)))
    let yDs = await yQ

    let series = ys.map(y => ({
      name: y.name,
      type: 'line',
      tiled: y.name,
      areaStyle: { normal: {} },
      data: yDs.map(v => v[y.field])
    }))

    return Promise.resolve({ xAxis, series })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function test() {
  try {
    const r = await getChart(
      'foxx_food_manage',
      { name: 'date', field: 'date' },
      [{}],
      [
        { field: 'wmpoiid', op: '=', cond: 9963039 },
        { field: 'minOrderCount', op: '=', cond: 1 }
      ]
    )
    console.log(r)
    // console.log(await getAllTableInfos())
  } catch (e) {
    console.error(e)
  }
}

// test()
