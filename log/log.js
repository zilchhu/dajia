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
