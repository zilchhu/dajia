import axios from 'axios'
import qs from 'qs'

import knx from '../../50/index.js'

import urls_ from './url.js'

let { cookie } = await knx('foxx_shop_reptile').first('cookie')
// cookie = "_lxsdk_cuid=1783f1010f2c8-0e0093e53152ba-13e3563-1fa400-1783f1010f3c8; _lxsdk=1783f1010f2c8-0e0093e53152ba-13e3563-1fa400-1783f1010f3c8; mtcdn=K; userTicket=OvHjUDUuybdMIOUdDcBTzgFrhFfwreIHGizuyUWf; u=97130574; n=Pjl617135409; _ga=GA1.2.1024151421.1615966028; _gid=GA1.2.688150990.1615966028; device_uuid=!b0bafb3f-51d6-4db9-a54f-8a65d0806873; uuid_update=true; wpush_server_url=wss://wpush.meituan.com; shopCategory=food; acctId=94861229; token=0suQC0euCzaVZAQmxsFlRndRl14_WjA8zUsHJauuq_Zs*; brandId=-1; wmPoiId=11270787; isOfflineSelfOpen=0; city_id=110105; isChain=0; existBrandPoi=false; ignore_set_router_proxy=false; region_id=1000110100; region_version=1615966500; newCategory=false; bsid=s7nRKxwEpQWVfQI9PXYd9DcWHlS0mVffFIqLtsMGrotc-wszcD-XMSeFaapuAVSAiLobRxwGTdOMMj0Mrg436Q; logistics_support=1; cityId=440300; provinceId=440000; city_location_id=110100; location_id=110105; pushToken=0suQC0euCzaVZAQmxsFlRndRl14_WjA8zUsHJauuq_Zs*; set_info=%7B%22wmPoiId%22%3A11270787%2C%22region_id%22%3A%221000110100%22%2C%22region_version%22%3A1615966500%7D; JSESSIONID=15w4zxe2titx01f1gdl91je4ql; setPrivacyTime=1_20210319; logan_custom_report=; logan_session_token=agihjwkae4m05sosdbnm; _lxsdk_s=178494b46fe-7f8-ee7-ebb%7C%7C29"

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
