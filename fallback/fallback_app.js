import Food from './food.js'
import Act from './act.js'
import Poi from './poi.js'
import log from '../log/log.js'

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
    log({meta, err})
  }
}

export async function loop(dataSource, f) {
  try {
    let count = dataSource.length
    for(let data of dataSource) {
      console.log(count)
      await wrap(f, data)
      count -= 1
    }
  } catch (err) {
    console.error(err)
  }
}