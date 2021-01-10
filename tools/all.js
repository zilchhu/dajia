import axios from 'axios'
import qs from 'qs'
import fs from 'fs'
import yaml from 'yaml'
import deepmerge from 'deepmerge'
import dayjs from 'dayjs'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import parse5 from 'parse5'

const koa = new Koa()
const router = new Router()

const singleCookie =
  '_lxsdk_cuid=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _ga=GA1.2.1511021963.1597473654; _lxsdk=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _hc.v=c9793375-e9a8-7952-72a7-e404fd7ad70a.1602157773; uuid=16db610009dfc3c606c8.1602213490.1.0.0; device_uuid=!39ecd268-5a7e-4541-8aa6-33fc60963ac7; uuid_update=true; acctId=23262521; brandId=-1; city_id=0; isChain=1; existBrandPoi=true; ignore_set_router_proxy=true; region_id=; region_version=0; newCategory=false; cityId=440300; provinceId=440000; city_location_id=0; location_id=0; pushToken=0BCjlFCGNeTf0_xqoT71TuF12Ymx2cPcm0s49sjFsfrg*; wpush_server_url=wss://wpush.meituan.com; e_u_id_3299326472=7e0dbe1fc46d29c6155e6acc5ce0c4c1; isOfflineSelfOpen=0; logan_custom_report=; bsid=YPF3VhNk_02OZorGYQ3Ihe1UGL7lwaTZH7AgAOT3UNaP-1A9ayCWM7SCaNOjvyWbHc76ugchn69-zAYIRJpksQ; token=06QT4N7pcCZf6cEcARzenRtMCGbUR-laXvgjt5Tf73Nw*; setPrivacyTime=7_20210104; wmPoiName=%E5%96%9C%E4%B8%89%E5%BE%B7%E7%94%9C%E5%93%81%E2%80%A2%E6%89%8B%E5%B7%A5%E8%8A%8B%E5%9C%86%EF%BC%88%E6%B1%9F%E5%8C%97%E5%BA%97%EF%BC%89; wmPoiId=9470231; logistics_support=1; shopCategory=food; set_info=%7B%22wmPoiId%22%3A9470231%2C%22ignoreSetRouterProxy%22%3Atrue%7D; JSESSIONID=10p53mwn1m2h3m4kw4krofu22; logan_session_token=pq4kw7z3wahlrjzs42aq; _lxsdk_s=176d10730d3-771-e50-8a%7C23262521%7C907'
const instance = axios.create({
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
    Cookie: singleCookie
  }
})

const id = 'F87A24ACA93043258B7D4AE0FD4F2246|1609236931131'
const metas = {
  appName: 'melody',
  appVersion: '4.4.0',
  ksid: 'MTBJZWMTA1MjUzOTA0OTU1MTAxTlQ2YUZiZDZQ'
}
const ncp = '2.0.0'
const instanceElm = axios.create({
  responseType: 'json',
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-length': '280',
    'content-type': 'application/json;charset=UTF-8',
    'invocation-protocol': 'Napos-Communication-Protocol-2',
    origin: 'https://melody-goods.faas.ele.me',
    referer: 'https://melody-goods.faas.ele.me/',
    'sec-ch-ua': `"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"`,
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'x-eleme-requestid': `${id}`
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

// elm
instanceElm.interceptors.request.use(
  config => {
    if (config.method == 'post') {
      const [service, method] = new URL(config.url).searchParams.get('method').split('.')
      config.data = {
        id,
        metas,
        ncp,
        service,
        method,
        params: {
          ...config.data
        },
      }
    }
    // console.log(config)
    return config
  },
  err => Promise.reject(err)
)

instanceElm.interceptors.response.use(
  res => {
    if (res.data.error != null || res.data.error != undefined) {
      return Promise.reject(res.data.error)
    }
    return res.data.result == null ? Promise.resolve(res.data) : Promise.resolve(res.data.result)
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

function cookie(wmPoiId) {
  return { Cookie: updateCookie(singleCookie, { wmPoiId }) }
}

function xshard(shopId) {
  return { 'x-shard': `shopid=${shopId}` }
}

function execRequest(inst = instance, req, args, headers) {
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
      return inst.get(url, { params, headers })
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
    return inst.post(url, body, { headers })
  } catch (err) {
    console.error(err)
  }
}

async function searchRace(api, vs, wmPoiId) {
  try {
    let v = vs.shift()
    if (!v) return Promise.reject('search maxed')
    let res = await execRequest(api, [v], {
      Cookie: updateCookie(singleCookie, { wmPoiId })
    })
    if (res.totalCount == 0) return searchRace(api, vs, wmPoiId)
    return Promise.resolve(res)
  } catch (err) {
    return Promise.reject(err)
  }
}

function b(req, args, headers) {
  return function() {
    return execRequest(req, args, headers)
  }
}

async function a(wmPoiId) {
  try {
    const y = readYaml('tools/all.yaml')
    const all = [
      // {
      //   task: '集点返券',
      //   promise: b(y.requests['集点返券/create'], [unix(), unix(90), [wmPoiId].join(',')])
      // },
      // { task: '代金券包', promise: b(y.requests['代金券包/create'], [unix(), unix(30), [wmPoiId], wmPoiId]) },
      // { task: '收藏有礼', promise: b(y.requests['收藏有礼/create'], [[wmPoiId]]) },
      // { task: '店内领券', promise: b(y.requests['店内领券/create'], [wmPoiId, unix(), unix(365)]) },
      // { task: '下单返券', promise: b(y.requests['下单返券/create'], [wmPoiId, date(), date(365)]) },
      // {
      //   task: '开具发票',
      //   promise: b(y.requests['开具发票/update'], {}, { Cookie: updateCookie(singleCookie, { wmPoiId }) })
      // },
      {
        task: '公告电话',
        promise: b(y.requests['公告电话/update'], ['15814227912'], { Cookie: updateCookie(singleCookie, { wmPoiId }) })
      }
      // { task: '下单返券', promise: b(y.requests['下单返券/create'], [wmPoiId, date(), date(365)]) }
    ]

    // const res = await execRequest(
    //   y.requests['营业设置/update'],
    //   {},
    //   { Cookie: updateCookie(singleCookie, { wmPoiId: 9470231 }) }
    // )
    // const res = await execRequest(y.requests['到店自取/update'], [9470231])
    // const res = await execRequest(y.requests['青山公益/update'], [9470231])
    // const res = await execRequest(y.requests['商品列表3/search'], ['招牌烧仙草 超人气推荐'], {
    //   Cookie: updateCookie(singleCookie, { wmPoiId: 9470231 })
    // })

    // const promises = y.rules['老板推荐']['甜品'].map(v =>
    //   typeof v == 'string'
    //     ? execRequest(y.requests['商品列表3/search'], [v], {
    //         Cookie: updateCookie(singleCookie, { wmPoiId: 9470231 })
    //       })
    //     : searchRace(y.requests['商品列表3/search'], v, 9470231)
    // )
    // let goods = await Promise.allSettled(promises)
    // goods = goods.filter(v => v.status == 'fulfilled' && v.value.totalCount > 0).map(v => v.value.productList[0])
    // const res = await Promise.all([
    //   execRequest(y.requests['老板推荐/update/state'], [9470231, 1]),
    //   execRequest(y.requests['老板推荐/update/products'], [goods.map(g => g.id).join(',')], {
    //     Cookie: updateCookie(singleCookie, { wmPoiId: 9470231 })
    //   })
    // ])
    // const res = await Promise.allSettled(all.map(v => v.promise()))
    // const policy = y.rules['满减活动']['甜品'].map(([a, b]) => ({
    //   price: a,
    //   discounts: [
    //     {
    //       code: 1,
    //       type: 'default',
    //       discount: b,
    //       poi_charge: b,
    //       mt_charge: 0,
    //       agent_charge: 0
    //     }
    //   ]
    // }))
    // const res = await execRequest(y.requests['满减活动/create'], [10085676, policy, unix(), unix(365)])

    // const res = await execRequest(y.requests['配送范围/get'], {}, cookie(10085676))
    // const fee = +res.logisticsPlanDetails[0].periods[0].spAreas[0].shippingFee + 4.1
    // const policy = [{ discount: fee, shipping_charge: '0', mt_charge: '0', poi_charge: fee, agent_charge: '0' }]
    // const res2 = await execRequest(y.requests['减配送费/create'], [10085676, policy, unix(), unix(365)])

    // const promises = y.rules['超值换购'].map(v =>
    //   execRequest(y.requests['商品列表2/search'], [10085676, v, Math.random()])
    // )
    // const goods = await Promise.allSettled(promises)
    // const actItems = goods
    //   .filter(v => v.status == 'fulfilled')
    //   .slice(0, 3)
    //   .map(v => v.value[0].groupData[0])
    //   .map(({ wm_poi_id, id, price, name }) => ({
    //     list: [`${wm_poi_id}_${id}_${price}`],
    //     dayLimit: -1,
    //     orderLimit: '1',
    //     mtCharge: 0,
    //     actItemPrice: '6.9',
    //     itemName: name
    //   }))
    // const res = await execRequest(y.requests['超值换购/create'], [unix(), unix(365), actItems], cookie(10085676))

    // const res = await execRequest(y.requests['折扣商品/get'], [10085676])
    // const res = await execRequest(y.requests['折扣商品/sort'], [[{"id":3741533070,"wmPoiId":"10085676","wmSkuId":3824275011,"sortNumber":"2","spuId":3412950683}]])

    // const res = await execRequest(undefined, y.requests.mt['分类列表/get'], [10085676])
    // const res = await execRequest(y.requests['分类列表/sort'], [10085676, 178984094, 1])

    // const res = await execRequest(y.requests['商品列表/get'], [10085676, 178984089])
    // const res = await execRequest(y.requests['商品列表/sort'], [10085676, 178984089, 3208729658, 1])

    // const res = await execRequest(y.requests['老板推荐/get/products'], [10085676])
    // const goods = await Promise.all(
    //   res.productList.map(v => execRequest(y.requests['商品列表/search'], [10085676, v.productName]))
    // )
    // const productSpuListStr = goods
    //   .map(v => v.productList[0])
    //   .sort((a, b) => b.sellCount - a.sellCount)
    //   .map(v => v.id)
    //   .join(',')

    // const res2 = await Promise.all([
    //   execRequest(y.requests['老板推荐/update/state'], [10085676, 1]),
    //   execRequest(y.requests['老板推荐/update/products'], [productSpuListStr], cookie(10085676))
    // ])

    /**
     * ELM     ELM      ELM     ELM
     */
    // const res = await execRequest(instanceElm, y.requests.elm['商品列表/search'], [2036923650, '招牌'], xshard(2036923650))

    const res = await execRequest(instanceElm, y.requests.elm['分类列表/get'], [2065322800])
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

a(9470231)

// koa.use(cors())
// koa.use(
//   bodyParser({
//     onerror: function(err, ctx) {
//       ctx.throw('body parse error', 422)
//     }
//   })
// )

// router.get('/date/:date', async ctx => {})

// koa.use(router.routes())
// koa.listen(9005, () => console.log('running at 9005'))
