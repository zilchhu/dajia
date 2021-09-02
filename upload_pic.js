import apprun from 'apprun'
import pLimit from 'p-limit'
import { uploadImg as uploadImgMt } from './test2.js'
import { uploadImg as uploadImgElm } from '../20/elm/test.js'

const app = apprun.app

async function wrap(f, meta, ws, ctx) {
  const _i = meta[meta.length - 1]
  try {
    const data = await f(...meta)
    console.log(data)
    ws.send(JSON.stringify({ event: '@upload-pic', state: { _i, meta, code: 0, data } }))
  } catch (err) {
    console.error(err)
    ws.send(JSON.stringify({ event: '@upload-pic', state: { _i, meta, code: 1, err: err.message ?? err } }))
    ctx.errors.push({ _i, meta, err: err.message ?? err })
  }
}

app.on('@upload-pic', async (data, ws) => {
  console.log('<-', data)
  const { state: { auth, pics, platform, shopId } } = data

  const limit = pLimit(20)
  let ctx = { errors: [] }
  
  const imgs = platform == 1 ?
    pics.map(pic => [auth, pic.filename, pic.uid]) :
    pics.map(pic => [auth, shopId, pic.filename, pic.uid])

  if (platform == 1) {
    await Promise.all(
      imgs.map(d => limit(() => wrap(uploadImgMt, d, ws, ctx)))
    )
  } else {
    await Promise.all(
      imgs.map(d => limit(() => wrap(uploadImgElm, d, ws, ctx)))
    )
  }

  ws.send(JSON.stringify({ event: '@upload-pic-end' }))
})

