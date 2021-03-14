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
// cookie = "_lxsdk=1775b772fbac8-0ee0aab2fb3d09-c791039-1fa400-1775b772fba57; _lxsdk_cuid=1775b772fbac8-0ee0aab2fb3d09-c791039-1fa400-1775b772fba57; device_uuid=!93be5d46-1201-4ccb-af5d-fc7911ec8970; pushToken=0W3TxK_HBq9NfYgc8QSfiM10zJmWPGtAGSbfwo66HYO8*; uuid_update=true; isNewCome=1; wpush_server_url=wss://wpush.meituan.com; acctId=40811325; token=0GxKRgM-DEYf8uUH-HGAvXeWDWGI4Lli4jeh0pHy1xPo*; brandId=-1; wmPoiId=-1; isOfflineSelfOpen=0; city_id=440300; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=false; bsid=hKVTULAN5KmuiXsa5cKTrvXvRwm7yjk_lDyU4NOQCHN0VO08EWEhiwJXKHq4lLXxc571wI7JH3zHFntMWQ_q7g; cityId=440300; provinceId=440000; city_location_id=440300; location_id=0; shopCategory=food; set_info=%7B%22wmPoiId%22%3A-1%2C%22ignoreSetRouterProxy%22%3Atrue%7D; setPrivacyTime=3_20210308; JSESSIONID=1rs0tl2s20hq8mlah3y8pbb94; logan_session_token=5s0z2pbefb22cqncthur; _lxsdk_s=17810fc91be-547-cb4-117%7C23262521%7C92"

let axiosConfig = {
  baseURL: 'https://waimaieapp.meituan.com',
  timeout: 3500,
  responseType: 'json',
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

const namespace = 'axios-retry'

const instance = axios.create(axiosConfig)

instance.interceptors.request.use(
  config => {
    config[namespace] = config[namespace] || {}
    config[namespace].data = config.data
    config[namespace].retryCount = config[namespace].retryCount || 0

    config.data = qs.stringify(config.data)
    return config
  },
  err => Promise.reject(err)
)

instance.interceptors.response.use(
  res => {
    if (res.data.code === 0) {
      // console.log(0)
      return res.data.data == '' || res.data.data == null ? res.data : res.data.data
    } else {
      // console.log(1)
      return Promise.reject(res.data)
    }
  },
  error => {
    const config = error.config

    if (!config || !config[namespace]) {
      return Promise.reject(error)
    }

    const shouldRetry =
      (/ETIMEDOUT|ECONNRESET|ECONNABORTED/.test(error.code) || error.msg == '服务器超时，请稍后再试') &&
      config[namespace].retryCount < 10

    if (shouldRetry) {
      config[namespace].retryCount += 1

      console.log('retry...', config[namespace].retryCount)
      return new Promise(resolve =>
        setTimeout(() => resolve(instance({ ...config, data: config[namespace].data })), 600)
      )
    }

    return Promise.reject(error)
  }
)

export default instance
export const urls = urls_
