import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'

import App from './index.js'
import FallbackApp from './fallback/fallback_app.js'

const appPoiCode = 't_fLkr2jOW5A'

const koa = new Koa()
const router = new Router()


koa.use(cors())
koa.use(
  bodyParser({
    onerror: function (err, ctx) {
      ctx.throw('body parse error', 422)
    }
  })
)

router.get('/test', async ctx => {
  ctx.body = { data: 'test' }
})

router.get('/pois', async ctx => {
  ctx.body = await new FallbackApp().poi.list()
})

// router.get('/poi/:poi', async ctx => {
//   const { poi } = ctx.params
//   ctx.body = { poi }
// })

router.get('/poi/:poi/foods', async ctx => {
  const { poi } = ctx.params
  ctx.body = await new FallbackApp(poi).food.list()
})

koa.use(router.routes())

koa.listen(8000, () => console.log('running at 8000'))
