import pLimit from 'p-limit'
import { updatePlan2, updatePlan3, substituteFood, delFoods } from './test2.js'
import { updatePlan } from '../20/elm/test.js'
import apprun from 'apprun'

const app = apprun.app

async function wrap(f, meta, ws, ctx) {
  const _i = meta[meta.length - 1]
  try {
    const data = await f(...meta)
    console.log(data)
    ws.send(JSON.stringify({ event: '@substitute-food', state: { _i, meta, code: 0, data } }))
  } catch (err) {
    console.error(err)
    ws.send(JSON.stringify({ event: '@substitute-food', state: { _i, meta, code: 1, err: err.message ?? err } }))
    ctx.errors.push({ _i, meta, err: err.message ?? err })
  }
}

async function substituteMtFoods(state, ws) {
  const { auth, jsonTable } = state
  let ctx = { errors: [] }
  const limitA = pLimit(1)
  const limitB = pLimit(1)

  let foods = [...jsonTable]

  let data = foods.map((v, i) => [
    auth,
    v.店铺id,
    v.分类名称,
    v.商品名称,
    v.替换后分类名称,
    v.替换后商品名称,
    i,
    v._i
  ])

  let uniqShops = Array.from(new Set(data.map(v => v[1])))
  let shops = uniqShops.map(s => data.filter(v => v[1] == s))

  await Promise.all(
    shops.map(shop => limitA(async () => {
      console.log(shop[0][1])

      await Promise.all(
        shop.map(d => limitB(() => wrap(substituteFood, d, ws, ctx)))
      )

      await wrap(delFoods, [auth, shop[0][1]], ws, ctx)
    }))
  )

  ws.send(JSON.stringify({ event: '@substitute-food', state: { _i: -1, errors: ctx.errors } }))
}

app.on('@substitute-food', async (data, ws) => {
  console.log('<-', data)
  const { state: { platform } } = data

  if (platform == 1) {
    await substituteMtFoods(data.state, ws)
  } 
})