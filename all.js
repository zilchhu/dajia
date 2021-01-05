import axios from 'axios'
import qs from 'qs'
import fs from 'fs'
import yaml from 'yaml'
import deepmerge from 'deepmerge'
import dayjs from 'dayjs'

const singleCookie =
  '_lxsdk_cuid=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _ga=GA1.2.1511021963.1597473654; _lxsdk=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _hc.v=c9793375-e9a8-7952-72a7-e404fd7ad70a.1602157773; uuid=16db610009dfc3c606c8.1602213490.1.0.0; device_uuid=!39ecd268-5a7e-4541-8aa6-33fc60963ac7; uuid_update=true; acctId=23262521; brandId=-1; city_id=0; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=false; cityId=440300; provinceId=440000; city_location_id=0; location_id=0; pushToken=0BCjlFCGNeTf0_xqoT71TuF12Ymx2cPcm0s49sjFsfrg*; wpush_server_url=wss://wpush.meituan.com; e_u_id_3299326472=7e0dbe1fc46d29c6155e6acc5ce0c4c1; isOfflineSelfOpen=0; logan_custom_report=; bsid=YPF3VhNk_02OZorGYQ3Ihe1UGL7lwaTZH7AgAOT3UNaP-1A9ayCWM7SCaNOjvyWbHc76ugchn69-zAYIRJpksQ; token=06QT4N7pcCZf6cEcARzenRtMCGbUR-laXvgjt5Tf73Nw*; setPrivacyTime=7_20210104; wmPoiName=%E5%96%9C%E4%B8%89%E5%BE%B7%E7%94%9C%E5%93%81%E2%80%A2%E6%89%8B%E5%B7%A5%E8%8A%8B%E5%9C%86%EF%BC%88%E6%B1%9F%E5%8C%97%E5%BA%97%EF%BC%89; wmPoiId=9470232; logistics_support=1; shopCategory=food; set_info=%7B%22wmPoiId%22%3A9470231%2C%22ignoreSetRouterProxy%22%3Atrue%7D; JSESSIONID=1c8s7rwrg6qqvful61565o3o0; logan_session_token=4g3yz07wacqttd2lqgjl; _lxsdk_s=176d10730d3-771-e50-8a%7C23262521%7C796'
const instance = axios.create({
  responseType: 'json',
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
    Cookie: singleCookie
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
      return res.data.data == '' || res.data.data == null ? Promise.resolve(res.data) : Promise.resolve(res.data.data)
    } else {
      return Promise.reject(res.data)
    }
  },
  err => Promise.reject(err)
)

function readYaml(path) {
  return yaml.parse(fs.readFileSync(path, 'utf8'))
}

function unix(addDay) {
  if (!addDay)
    return dayjs()
      .startOf('day')
      .unix()
  return dayjs()
    .startOf('day')
    .add(addDay, 'day')
    .unix()
}

function date(addDay) {
  if (!addDay) return dayjs().format('YYYY-MM-DD')
  return dayjs()
    .startOf('day')
    .add(addDay, 'day')
    .format('YYYY-MM-DD')
}

function createObj(path, value) {
  return path.reduceRight((s, step) => ({ [step]: s }), value)
}


function updateCookie(cookie, updates) {
  function parseCookie(cookie) {
    let c1 = cookie.split(';').map(kv => ({ [kv.split('=')[0].trim()]: kv.split('=')[1].trim() }))
    let c2 = Object.assign({}, ...c1)
    return c2
  }

  function writeCookie(cookies, updates) {
    return {
      ...cookies,
      ...updates
    }
  }

  function* entries(obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]]
    }
  }

  function stringify(cookies) {
    let s1 = []
    for (let [key, value] of entries(cookies)) {
      s1.push(`${key}=${encodeURIComponent(value)}`)
    }
    return s1.join('; ')
  }
  
  return stringify(writeCookie(parseCookie(cookie), updates))
}


function execRequest(req, args, headers) {
  try {
    let { url, params, body, jsonfy, requires } = req
    if (requires) {
      args = requires.reduce(
        (s, r, i) => deepmerge(s, createObj(r.split('/'), args[i]), { arrayMerge: (_, source) => source }),
        {}
      )
    }
    if (params) {
      params = deepmerge(params, args, { arrayMerge: (_, source) => source })
      return instance.get(url, { params, headers })
    }
    body = deepmerge(body, args, { arrayMerge: (_, source) => source })
    if (jsonfy) {
      body = Object.keys(body).reduce(
        (o, k) => ({ ...o, [k]: jsonfy.includes(k) ? JSON.stringify(body[k]) : body[k] }),
        {}
      )
    }
    console.log(body)
    // return
    return instance.post(url, body, { headers })
  } catch (err) {
    console.error(err)
  }
}

async function a() {
  try {
    const y = readYaml('all.yaml')

    // const res = await execRequest(y.requests['集点返券/create'], [unix(), unix(90), [9470231].join(',')])
    // const res = await execRequest(y.requests['代金券包/create'], [unix(), unix(30), [9470231], 9470231])
    // const res = await execRequest(y.requests['收藏有礼/create'], [[9470231]])
    // const res = await execRequest(y.requests['店内领券/create'], [9470231, unix(), unix(365)])
    // const res = await execRequest(y.requests['下单返券/create'], [9470231, date(), date(365)])

    // const res = await execRequest(
    //   y.requests['开具发票/update'],
    //   {},
    //   { Cookie: updateCookie(singleCookie, { wmPoiId: 9470231 }) }
    // )
    // const res = await execRequest(
    //   y.requests['公告电话/update'],
    //   {},
    //   { Cookie: updateCookie(singleCookie, { wmPoiId: 9470231 }) }
    // )


    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

a()
