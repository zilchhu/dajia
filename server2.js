import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import dayjs from 'dayjs'
import fs from 'fs'

import App from './index.js'

const appPoiCode = 't_fLkr2jOW5A'

const koa = new Koa()
const router = new Router()

koa.use(
  bodyParser({
    onerror: function (err, ctx) {
      ctx.throw('body parse error', 422)
    }
  })
)

koa.use(async (ctx, next) => {
  const startTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
  try {
    await next()
    log(startTime)
    log(JSON.stringify({ url: ctx.href, body: ctx.body }))
  } catch (error) {
    log(startTime)
    log(JSON.stringify({ url: ctx.href, body: ctx.body }))
    log(error)
  }
})

router.get('/pois/ids', async ctx => {
  ctx.body = await new App(appPoiCode).poi.getids()
})

router.get('/pois/:appPoiCodes', async ctx => {
  const { appPoiCodes } = ctx.params
  ctx.body = await new App(appPoiCode).poi.mget(appPoiCodes)
})

router.get('poi/foods', async ctx => {
  const {poi} = ctx.query
  ctx.body = await new App(poi).food.list()
})

koa.use(router.routes())

koa.on('error', (err, ctx) => {
  const startTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
  log(startTime)
  log(JSON.stringify({ url: ctx.href, body: ctx.body }))
  log(err)
})

koa.listen(8000, () => console.log('run...'))

function log(data) {
  try {
    fs.appendFileSync('./log/log.txt', data + '\n')
  } catch (error) {
    console.error(error)
  }
}
