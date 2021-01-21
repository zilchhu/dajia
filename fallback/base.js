import axios from 'axios'
import qs from 'qs'

import urls_ from './url.js'

let axiosConfig = {
  baseURL: 'https://waimaieapp.meituan.com',
  responseType: 'json',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie:
      '__mta=143481098.1605524446091.1610023402832.1610023424261.23; _ga=GA1.2.1511021963.1597473654; _hc.v=c9793375-e9a8-7952-72a7-e404fd7ad70a.1602157773; _lxsdk=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _lxsdk_cuid=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; uuid=16db610009dfc3c606c8.1602213490.1.0.0; device_uuid=!39ecd268-5a7e-4541-8aa6-33fc60963ac7; pushToken=0BCjlFCGNeTf0_xqoT71TuF12Ymx2cPcm0s49sjFsfrg*; uuid_update=true; acctId=23262521; token=0ZYJ8xEhxXGWervc28-KnTF_bRkAfHLEuU1ywvC-dEzs*; brandId=-1; city_id=0; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=false; bsid=IkuK4w3u1sgGWZWfMf1kCTboJJuA-VgfcfmILhN1pHTxJV-mqvVC9WDWzEfiqXe02dwUdOs3GiBDPgxu1gWBuw; cityId=440300; provinceId=440000; city_location_id=0; location_id=0; wpush_server_url=wss://wpush.meituan.com; setPrivacyTime=1_20210114; logan_custom_report=; isOfflineSelfOpen=0; wmPoiId=9993224; wmPoiName=%E5%8F%A4%E5%BE%A1%E8%B4%A1%E8%8C%B6%E2%80%A2%E6%89%8B%E6%8A%93%E9%A5%BC%E2%80%A2%E5%B0%8F%E5%90%83%EF%BC%88%E7%A1%9A%E5%8F%A3%E5%BA%97%EF%BC%89; logistics_support=1; set_info=%7B%22wmPoiId%22%3A9993224%2C%22ignoreSetRouterProxy%22%3Atrue%7D; JSESSIONID=1jud1i4xujfefkhpxjaw881zd; shopCategory=food; logan_session_token=ab5foxmity6tzf43jn29; _lxsdk_s=176fe3077ae-4a6-839-dcb%7C23262521%7C61',
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

    const shouldRetry = (/ETIMEDOUT|ECONNRESET/.test(error.code) || err.msg =='服务器超时，请稍后再试') && config[namespace].retryCount < 3

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
