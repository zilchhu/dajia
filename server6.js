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
