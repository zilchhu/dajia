import util from 'util'
import xls2Json from 'xls-to-json'
import Excel from 'exceljs'

const axls2Json = util.promisify(xls2Json)

export async function readXls(path, sheet) {
  try {
    let res = await axls2Json({
      input: `${path}`,
      sheet,
      output: `${path}.json`
    })
    return res
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function parseXlsxFromBuffer(buffer) {
  try {
    const workbook = new Excel.Workbook()
    await workbook.xlsx.load(Buffer.from(buffer))

    const sheet = workbook.worksheets[0]
    let table = sheet.getSheetValues().filter(v => v != null)

    let header = table[0]
    let body = table.slice(1).map((row, rowN) => row.reduce((a, c, i) => ({ ...a, [header[i]]: c, rowN }), {}))

    return Promise.resolve({ header, body, workbook })
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function writeXls(json, path) {
  try {
    // let p = path.join(dir[0], sanitize(poi.name) + '.xlsx')
    let header = json.length > 0 ? Object.keys(json[0]) : []
    let body = json.map(v => header.map(h => v[h]))
    let wb = new Excel.Workbook()
    let ws = wb.addWorksheet('Sheet1')
    ws.addRows([header].concat(body))

    await wb.xlsx.writeFile(path)
    return path
  } catch (err) {
    console.error(err)
    return null
  }
}