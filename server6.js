import http from 'http'
import sockjs from 'sockjs'
import FallbackApp from './fallback/fallback_app.js'

import knx from '50/index.js'

var echo = sockjs.createServer()
echo.on('connection', function (conn) {
  conn.on('data', async function (message) {
    let res = await testsSync(message, (await knx('foxx_shop_reptile').first('cookie')).cookie)
    conn.write(res)
  })
  conn.on('close', function () { })
})

var server = http.createServer()
echo.installHandlers(server, { prefix: '/tests_sync' })
server.listen(9999, '0.0.0.0')

async function testsSync(wmPoiId, cookie) {
  const fallbackApp = new FallbackApp(wmPoiId, cookie)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      console.log(ok)
      return Promise.resolve('测试产品同步成功')
    }
    return Promise.reject('测试产品同步失败')
  } catch (e) {
    return Promise.reject(e)
  }
}

var echo2 = sockjs.createServer()
var server2 = http.createServer()
echo2.installHandlers(server2, { prefix: '/price_update' })
server2.listen(9998, '0.0.0.0')
export var price_update_server = echo2

var echo3 = sockjs.createServer()
var server3 = http.createServer()
echo3.installHandlers(server3, { prefix: '/price_update3' })
server3.listen(9997, '0.0.0.0')
export var price_update_server3 = echo3

export async function wrap(f, meta, conn) {
  try {
    conn.write(JSON.stringify(meta.slice(1)))
    console.log(meta.slice(1))
    const res = await f(...meta)
    console.log(res)
    conn.write(JSON.stringify(res))
  } catch (err) {
    console.error(err)
    conn['custom'].errors.push({ meta, err: err.message ?? err })
    conn.write(err.message ?? JSON.stringify(err))
  }
}

export async function loop2(f, dataSource, conn, del) {
  try {
    conn['custom'] = { errors: [] }
    let count = dataSource.length
    let idx = 0
    for (let data of dataSource) {
      conn.write(count)
      await wrap(f, data, conn)

      if (del) {
        let comp = dataSource[idx + 1] && dataSource[idx + 1][1] == data[1]
        if (!comp) {
          try {
            conn.write(JSON.stringify(await del.test(data[0], data[1])))
          } catch (err) {
            conn.write(err.message ?? err)
          }
        }
      }
      count -= 1
      idx += 1
    }
    conn.write('\n错误结果\n')
    conn.write(JSON.stringify(conn['custom'].errors))
  } catch (err) {
    conn.write(err.message)
  }
}
