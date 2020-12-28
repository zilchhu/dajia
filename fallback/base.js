import axios from 'axios'
import qs from 'qs'

import urls_ from './url.js'

const instance = axios.create({
  responseType: 'json',
  baseURL: 'https://e.waimai.meituan.com',
  headers: {
    Host: 'e.waimai.meituan.com',
    Accept: '*/*',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    Referer:
      'https://e.waimai.meituan.com/reuse/product/food/r/editView?wmPoiId=9995398&spuId=3128435564&from=new&productNew=1',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Cookie:
      '__mta=146715147.1599578598056.1607230369847.1607918324283.22; _lxsdk_cuid=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; acctId=23262521; _ga=GA1.2.1511021963.1597473654; _lxsdk=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; classRoomTips=true; _hc.v=c9793375-e9a8-7952-72a7-e404fd7ad70a.1602157773; uuid=16db610009dfc3c606c8.1602213490.1.0.0; igateApp=customer; __mta=146715147.1599578598056.1607047578729.1607047578749.8; bizad_cityId=440307; bizad_second_city_id=440300; bizad_third_city_id=440307; wmPoiName=%E5%8F%A4%E5%BE%A1%E8%B4%A1%E8%8C%B6%E2%80%A2%E6%89%8B%E6%8A%93%E9%A5%BC%E2%80%A2%E5%B0%8F%E5%90%83%EF%BC%88%E5%A4%A7%E8%8A%AC%E4%BF%A1%E5%92%8C%E5%BA%97%EF%BC%89; bmm-uuid=8187924a-26c6-0a7e-5c0f-aaf09ad861cf; e_u_id_3299326472=7e0dbe1fc46d29c6155e6acc5ce0c4c1; JSESSIONID=pku4w9ct5no9nu3r1bwwy2lq; token=0cEI8iDMVU7dLyMa9eOWf31VtBcmL68xWKpBn4YbnMm0*; wmPoiId=10711763; bsid=cqhg-UOZ5cHHMchup1QcZipEMgqNBRdfq90ixg8l0YMMv11WbFx9y0gptMfksLYk8hydReH63dHsrnrxHP3gzw; _lxsdk_s=176a2b8043e-5d6-533-a4d%7C23262521%7C29'
  }
})

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
      return res.data.data == "" || res.data.data == null ? res.data : res.data.data
    } else {
      // console.log(1)
      return Promise.reject(res.data)
    }
  },
  err => Promise.reject(err)
)

export default instance
export const urls = urls_