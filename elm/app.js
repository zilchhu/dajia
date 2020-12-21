import Food from './food.js'

export default class App {
  constructor(shopId) {
    this.food = new Food(shopId)
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