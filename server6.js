import http from 'http'
import sockjs from 'sockjs'
import FallbackApp from './fallback/fallback_app.js'
 
var echo = sockjs.createServer();
echo.on('connection', function(conn) {
    conn.on('data', async function(message) {
        let res = await testsSync(message)
        conn.write(res)
    });
    conn.on('close', function() {});
});
 
var server = http.createServer();
echo.installHandlers(server, {prefix:'/tests_sync'});
server.listen(9999, '0.0.0.0');

async function testsSync(wmPoiId) {
  const fallbackApp = new FallbackApp(wmPoiId)
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

var echo2 = sockjs.createServer();
var server2 = http.createServer();
echo2.installHandlers(server2, {prefix:'/price_update'});
server2.listen(9998, '0.0.0.0');
export var price_update_server = echo2

async function wrap(f, meta, conn) {
  try {
    conn.write(...meta)
    const res = await f(...meta)
    conn.write(JSON.stringify(res))
  } catch (err) {
    conn.write(err.message ?? err)
  }
}

export async function loop2(f, dataSource, conn, del) {
  try {
    let count = dataSource.length
    for (let data of dataSource) {
      conn.write(count)
      await wrap(f, data, conn)

      if (del) {
        let idx = data[data.length - 1]
        let comp = dataSource[idx + 1] && dataSource[idx + 1][0] == data[0]
        if (!comp) {
          try {
            conn.write(await del.test(data[0]))
          } catch (err) {
            conn.write(err.message ?? err)
          }
        }
      }
      count -= 1
    }
  } catch (err) {
    conn.write(err.message)
  }
}
