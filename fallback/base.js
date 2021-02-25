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

let Cookie = '_lxsdk_cuid=1775b772fbac8-0ee0aab2fb3d09-c791039-1fa400-1775b772fba57; _lxsdk=1775b772fbac8-0ee0aab2fb3d09-c791039-1fa400-1775b772fba57; device_uuid=!93be5d46-1201-4ccb-af5d-fc7911ec8970; uuid_update=true; acctId=23262521; brandId=-1; city_id=0; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=false; cityId=440300; provinceId=440000; city_location_id=0; location_id=0; pushToken=0W3TxK_HBq9NfYgc8QSfiM10zJmWPGtAGSbfwo66HYO8*; wpush_server_url=wss://wpush.meituan.com; isOfflineSelfOpen=0; logan_custom_report=; wmPoiName=%E5%96%9C%E4%B8%89%E5%BE%B7%E7%94%9C%E5%93%81%E2%80%A2%E6%89%8B%E5%B7%A5%E8%8A%8B%E5%9C%86%EF%BC%88%E5%A4%A7%E6%9C%97%E5%BA%97%EF%BC%89; token=0tsGMyMPYmUawmMHQyc5-TSEgHsLN4bwGskJ0fOEFmgQ*; bsid=mC34NV__Jr20X-y-v-UuLXz1ctgNKh6DOxMoLBeN1D8SmYLFNegyHS3rRG1WRxpjOjwI54pAydTC9dvXcWhwrg; wmPoiId=10085676; logistics_support=1; shopCategory=food; set_info=%7B%22wmPoiId%22%3A10085676%2C%22ignoreSetRouterProxy%22%3Atrue%7D; JSESSIONID=1tmlikg4ma7k71jldogktf5w3z; setPrivacyTime=8_20210225; logan_session_token=gkh18lg6aa3g2ejljteo'
async function fetchCookie() {
  try {
    const {cookie} = await knx('foxx_shop_reptile').first('cookie')
    Cookie = cookie
  } catch (e) {
    console.error(e)
  }
}

// console.log(Cookie)

let axiosConfig = {
  baseURL: 'https://waimaieapp.meituan.com',
  responseType: 'json',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie,
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

    const shouldRetry = (/ETIMEDOUT|ECONNRESET/.test(error.code) || error.msg =='服务器超时，请稍后再试') && config[namespace].retryCount < 3

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
