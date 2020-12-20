import axios from 'axios'
import urls_ from './url.js'

const id = 'E763746112EB41CEAE98F99BAAD6BCBE|1608187997828'
const metas = {
  appName: 'melody',
  appVersion: '4.4.0',
  ksid: 'OTAZOTMTA1MjUzOTA0OTU1MTAxTlJ2SkZzcDVQ'
}
const ncp = '2.0.0'

const instance = axios.create({
  baseURL: 'https://app-api.shop.ele.me/',
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-length': '280',
    'content-type': 'application/json;charset=UTF-8',
    'invocation-protocol': 'Napos-Communication-Protocol-2',
    origin: 'https://melody-goods.faas.ele.me',
    referer: 'https://melody-goods.faas.ele.me/',
    'sec-ch-ua': `"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"`,
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'x-eleme-requestid': `${id}`
  }
})

instance.interceptors.request.use(
  config => {
    if (config.method == 'post') {
      config.data = {
        id,
        metas,
        ncp,
        ...config.data
      }
    }
    // console.log(config)
    return config
  },
  err => Promise.reject(err)
)

instance.interceptors.response.use(
  res => {
    if (res.data.error) {
      return Promise.reject(res.data.error)
    }
    return res.data.result
  },
  err => Promise.reject(err)
)

export default instance
export const urls = urls_
