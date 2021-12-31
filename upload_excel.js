import apprun from "apprun"
import { readXls } from "./utils/parse.js"

const app = apprun.app

app.on("@upload-table", async (data, ws) => {
  console.log("<-", data)
  let jsonTable = await readXls(`uploads/${data.state.table}`, "Sheet1")
  jsonTable = jsonTable.filter(v => Object.values(v).join("") != "").map((v, i) => ({ ...v, _i: i }))
  data.state = { jsonTable }
  ws.send(JSON.stringify(data))
})
