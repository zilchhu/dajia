import axios from 'axios'
import qs from 'qs'

import knex from 'knex'

const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai'
  }
})

import urls_ from './url.js'

let { cookie } = await knx('foxx_shop_reptile').first('cookie')


let axiosConfig = {
  baseURL: 'https://waimaieapp.meituan.com',
  responseType: 'text',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie: cookie,
    Host: 'waimaie.meituan.com',
    Origin: 'https://waimaie.meituan.com',
    Referer: 'https://waimaie.meituan.com/v2/shop/manage/shopInfo?ignoreSetRouterProxy=true',
    'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
    'sec-ch-ua-mobile': '?0',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

const instance2 = axios.create(axiosConfig)

instance2.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    return config
  },
  err => Promise.reject(err)
)

instance2.interceptors.response.use(
  res => {
    return Promise.resolve(res.data)
  },
  err => Promise.reject(err)
)

export default instance2
export const urls = urls_
