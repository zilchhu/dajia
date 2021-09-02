import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import App from './index.js'

const appPoiCode = 't_fLkr2jOW5A'

const koa = new Koa()
const router = new Router()

koa.use(bodyParser({
  onerror: function (err, ctx) {
    ctx.throw('body parse error', 422);
  }
}))

router.get('/test', async ctx => {
  ctx.body = { data: 'test' }
})

router.post('/test', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'test post' }
})

router.post('/order/paid', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.post('/order/pri', async ctx => {
  console.log(ctx.request.body)
  try {
    await new App(appPoiCode).order.batchPullPhoneNumber(0, 1000)
  } catch (error) {
    console.error(error)
  }
  ctx.body = { data: 'ok' }
})

router.post('order/logistics/status', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.post('/order/confirmed', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.post('/order/completed', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.post('/order/checked', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.post('/order/reminded', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.post('/order/updated', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.post('/order/claimed', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.get('/order/canceled', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.get('/order/part_refund', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.get('/order/full_refund', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

router.post('/poi/status', async ctx => {
  console.log(ctx.request.body)
  ctx.body = { data: 'ok' }
})

koa.use(router.routes())

koa.listen(80, () => console.log('running at 80'))