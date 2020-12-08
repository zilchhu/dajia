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
      '__mta=143481098.1605524446091.1605524446091.1605524446091.1; _lxsdk_cuid=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _ga=GA1.2.1511021963.1597473654; _lxsdk=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; ci=30; rvct=30; _hc.v=c9793375-e9a8-7952-72a7-e404fd7ad70a.1602157773; uuid=16db610009dfc3c606c8.1602213490.1.0.0; device_uuid=!39ecd268-5a7e-4541-8aa6-33fc60963ac7; uuid_update=true; acctId=23262521; brandId=-1; city_id=0; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=false; cityId=440300; provinceId=440000; city_location_id=0; location_id=0; pushToken=0BCjlFCGNeTf0_xqoT71TuF12Ymx2cPcm0s49sjFsfrg*; wpush_server_url=wss://wpush.meituan.com; _lx_utm=utm_source%3DBaidu%26utm_medium%3Dorganic; e_u_id_3299326472=7e0dbe1fc46d29c6155e6acc5ce0c4c1; token=0kPr5IBPARIyJKF357xHCL-4q56HcrJpn2vtLRVDRvcg*; isOfflineSelfOpen=0; bsid=pe1-LZBrAwEjOZ-3JlVU9AXchxdrp3ycFKK0DJLgRErSHdTYYkg30mrQbiZHxtT_iZDl7q754QB85N4Z7Zu0GQ; waimai_e_https_flag=true; wmPoiName=%E5%8F%A4%E5%BE%A1%E8%B4%A1%E8%8C%B6%E2%80%A2%E6%89%8B%E6%8A%93%E9%A5%BC%E2%80%A2%E5%B0%8F%E5%90%83%EF%BC%88%E5%A4%A7%E8%8A%AC%E4%BF%A1%E5%92%8C%E5%BA%97%EF%BC%89; wmPoiId=2924399; logistics_support=1; shopCategory=food; set_info=%7B%22wmPoiId%22%3A2924399%2C%22ignoreSetRouterProxy%22%3Atrue%7D; JSESSIONID=1qzmp4e84a52x1vcbydxfmg0s3; setPrivacyTime=2_20201123; logan_session_token=nwmwk5cieqscjtcx98xs; logan_custom_report=; _lxsdk_s=175f2b64bc5-666-e2e-ab8%7C23262521%7C62'
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