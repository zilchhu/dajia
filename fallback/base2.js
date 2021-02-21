import axios from 'axios'
import qs from 'qs'

import urls_ from './url.js'

let axiosConfig = {
  baseURL: 'https://waimaieapp.meituan.com',
  responseType: 'text',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Cookie:
      '_lxsdk_cuid=1775b772fbac8-0ee0aab2fb3d09-c791039-1fa400-1775b772fba57; _lxsdk=1775b772fbac8-0ee0aab2fb3d09-c791039-1fa400-1775b772fba57; uuid=899f93173acef791d886.1612921512.1.0.0; wpush_server_url=wss://wpush.meituan.com; device_uuid=!93be5d46-1201-4ccb-af5d-fc7911ec8970; uuid_update=true; acctId=23262521; token=0W3TxK_HBq9NfYgc8QSfiM10zJmWPGtAGSbfwo66HYO8*; brandId=-1; isOfflineSelfOpen=0; city_id=0; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=false; bsid=IkuK4w3u1sgGWZWfMf1kCTboJJuA-VgfcfmILhN1pHTxJV-mqvVC9WDWzEfiqXe02dwUdOs3GiBDPgxu1gWBuw; cityId=440300; provinceId=440000; city_location_id=0; location_id=0; pushToken=0W3TxK_HBq9NfYgc8QSfiM10zJmWPGtAGSbfwo66HYO8*; setPrivacyTime=3_20210210; wmPoiName=%E8%B4%A1%E8%8C%B6%E2%80%A2%E6%89%8B%E6%8A%93%E9%A5%BC%E2%80%A2%E5%B0%8F%E5%90%83%EF%BC%88%E8%B5%A3%E5%B7%9E%E6%97%97%E8%88%B0%E5%BA%97%EF%BC%89; logistics_support=1; wmPoiId=-1; set_info=%7B%22wmPoiId%22%3A-1%2C%22ignoreSetRouterProxy%22%3Atrue%7D; shopCategory=food; JSESSIONID=8b438b5p7n131ms7gvyxmjdnm; logan_session_token=re686x9sfkvbnqxb28td; logan_custom_report=; _lxsdk_s=177b2a5f6d9-c28-6f1-b53%7C23262521%7C780',
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
