import App from './app.js'
import log from './log/log.js'

async function test() {

}


async function wrap(f, meta) {
  try {
    console.log(...meta)
    const res = await f(...meta)
    console.log(res)
  } catch (err) {
    console.error(err)
    log({meta, err})
  }
}

async function loop(dataSource, f) {
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

test()