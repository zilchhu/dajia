import WebSocket from "ws"
import apprun from 'apprun'
import './upload_excel.js'
import './update_food.js'
import './substitute_food.js'
import './upload_pic.js'
import './export_excel.js'

const app = apprun.app

const wss = new WebSocket.Server({ port: 11180 })

wss.on('connection', function (ws) {
  ws.on('message', async function (data) {
    try {
      const json = JSON.parse(data)
      app.run(json.event, json, ws)
    } catch (e) {
      console.error(e)
    }
  })

  ws.on('close', function () {
    console.log('closing ws connection')
  })

  console.log('started ws connection')
})

console.log('ws listen at 11180')

/** ================================================================== */

app.on('@record', data => {
  console.log(data)
})