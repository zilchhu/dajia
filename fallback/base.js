import axios from 'axios'
import qs from 'qs'

import urls_ from './url.js'

let axiosConfig = {
  baseURL: 'https://waimaieapp.meituan.com',
  responseType: 'json',
  headers: {
    Host: 'waimaieapp.meituan.com',
    Accept: '*/*',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    Referer: 'https://waimaieapp.meituan.com',
    // 'https://waimaieapp.meituan.com/decoration/bossRecommend?_source=PC&token=06QT4N7pcCZf6cEcARzenRtMCGbUR-laXvgjt5Tf73Nw*&acctId=23262521&wmPoiId=9470231&region_id=&device_uuid=!39ecd268-5a7e-4541-8aa6-33fc60963ac7&bsid=YPF3VhNk_02OZorGYQ3Ihe1UGL7lwaTZH7AgAOT3UNaP-1A9ayCWM7SCaNOjvyWbHc76ugchn69-zAYIRJpksQ&appType=3&fromPoiChange=false',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Cookie:
      'acctId=23262521; classRoomTips=true; igateApp=customer; __mta=146715147.1599578598056.1607047578729.1607047578749.8; bmm-uuid=8187924a-26c6-0a7e-5c0f-aaf09ad861cf; bsid=YPF3VhNk_02OZorGYQ3Ihe1UGL7lwaTZH7AgAOT3UNaP-1A9ayCWM7SCaNOjvyWbHc76ugchn69-zAYIRJpksQ; token=06QT4N7pcCZf6cEcARzenRtMCGbUR-laXvgjt5Tf73Nw*; bizad_second_city_id=440300; bizad_cityId=440306; bizad_third_city_id=440306; wmPoiName=%E5%96%9C%E4%B8%89%E5%BE%B7%E7%94%9C%E5%93%81%E2%80%A2%E6%89%8B%E5%B7%A5%E8%8A%8B%E5%9C%86%EF%BC%88%E6%96%B0%E5%AE%89%E5%BA%97%EF%BC%89; logan_session_token=78agtutpbpjme63du48n; logan_custom_report=; _ga=GA1.2.1511021963.1597473654; _hc.v=c9793375-e9a8-7952-72a7-e404fd7ad70a.1602157773; _lxsdk=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _lxsdk_cuid=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; uuid=16db610009dfc3c606c8.1602213490.1.0.0; JSESSIONID=11c5trc9ibnqpceenawhf4x; wmPoiId=7937650; _lxsdk_s=176ebe9c4f6-ac4-610-060%7C23262521%7C2'
  }
}

const instance = axios.create(axiosConfig)
const instance2 = axios.create({ ...axiosConfig, responseType: 'text' })

instance.interceptors.request.use(
  config => {
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
  err => Promise.reject(err)
)

export default instance
export const urls = urls_
