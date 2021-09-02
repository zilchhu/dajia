import apprun from 'apprun'
import dayjs from 'dayjs'
import { writeXls } from './utils/parse.js'

const app = apprun.app

app.on('@export-table', async (data, ws) => {
  console.log('<-', data)
  const { state: { json } } = data

  const path = await writeXls(json, `uploads/table_pic_${dayjs().unix()}.xlsx`)
  data.state = { path: path?.replace('uploads/', '') }
  ws.send(JSON.stringify(data))
})

