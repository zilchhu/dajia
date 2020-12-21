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
      '__mta=143481098.1605524446091.1608429673878.1608429677625.8; _lxsdk_cuid=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _ga=GA1.2.1511021963.1597473654; _lxsdk=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _hc.v=c9793375-e9a8-7952-72a7-e404fd7ad70a.1602157773; uuid=16db610009dfc3c606c8.1602213490.1.0.0; device_uuid=!39ecd268-5a7e-4541-8aa6-33fc60963ac7; uuid_update=true; acctId=23262521; brandId=-1; city_id=0; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=false; cityId=440300; provinceId=440000; city_location_id=0; location_id=0; pushToken=0BCjlFCGNeTf0_xqoT71TuF12Ymx2cPcm0s49sjFsfrg*; token=0OdZ1nNSDj3b7IhCGLjAp_Lj_j7PiBkDlaRgQrGRN9PM*; bsid=AbhPHIx-BY1epEHakkah5FH0hfvbOk4YQFY9iin2AuxxGK1hkwwuQYpAlaumZGfntpnToRQC-vErNSPkPbiFRw; wmPoiId=7373263; logistics_support=1; wpush_server_url=wss://wpush.meituan.com; shopCategory=food; waimai_e_https_flag=true; set_info=%7B%22wmPoiId%22%3A7373263%2C%22ignoreSetRouterProxy%22%3Atrue%7D; JSESSIONID=1mctt4ii29ihnlibqcyag6mf4; setPrivacyTime=1_20201221; logan_session_token=svt77xnlvdceiwo8y4gk; logan_custom_report=; _lxsdk_s=17682f87abb-1df-c38-05a%7C23262521%7C4'
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