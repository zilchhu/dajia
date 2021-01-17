import Food from './food.js'
import Act from './act.js'
import Poi from './poi.js'

import log from '../log/log.js'
import fs from 'fs'
import util from 'util'
import xls2Json from 'xls-to-json'
import sleep from 'sleep-promise'
const axls2Json = util.promisify(xls2Json)

export default class FallbackApp {
  constructor(wmPoiId) {
    this.food = new Food(wmPoiId)
    this.act = new Act(wmPoiId)
    this.poi = new Poi(wmPoiId)
  }
}

export async function wrap(f, meta) {
  try {
    console.log(...meta)
    const res = await f(...meta)
    console.log(res)
  } catch (err) {
    console.error(err)
    log({ meta, err })
  }
}

export async function loop(f, dataSource, slow, del) {
  try {
    let count = dataSource.length
    for (let data of dataSource) {
      console.log(count)
      await wrap(f, data)

      if (del) {
        let idx = data[data.length - 1]
        let comp = dataSource[idx + 1] && dataSource[idx + 1][0] == data[0]
        if (!comp) {
          try {
            console.log(await del.test(data[0]))
          } catch (err) {
            console.error(err)
            log({ data, err })
          }
        }
      }
      if (slow) await sleep(4000)
      count -= 1
    }
  } catch (err) {
    console.error(err)
  }
}

export function readJson(path) {
  return JSON.parse(fs.readFileSync(path))
}

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
    return null
  }
}
