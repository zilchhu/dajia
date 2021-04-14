import fs from 'fs'
import dayjs from 'dayjs'

export default function log(err) {
  const time = dayjs().format('YYYY/MM/DD HH:mm:ss')
  try {
    fs.appendFileSync('log/log.txt', JSON.stringify({ time, ...err }) + ',' + '\n')
  } catch (error) {
    fs.appendFileSync('log/log.txt', err + '\n')
  }
}

// let data = JSON.parse(fs.readFileSync('elm/log/log.json'))
// data = data.map(v => {
//   let k = v.meta
//   return { shopid: k[0], name: k[1], category: k[2], newname: k[3] }
// })
// fs.writeFileSync('elm/log/log2.json', JSON.stringify(data))

