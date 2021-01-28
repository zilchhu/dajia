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
import htmlparser2 from 'htmlparser2'
import FallbackApp, { loop, wrap, readJson, readXls } from '../fallback/fallback_app.js'
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

function omit(obj, ks) {
  let newKs = Object.keys(obj).filter(v => !ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

function keep(obj, ks) {
  let newKs = Object.keys(obj).filter(v => ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

const koa = new Koa()
const router = new Router()

const y = readYaml('tools/all.yaml')

const singleCookie = y.headers['基本设置']['Cookie']

const baseHeaders = y.headers['基本设置']
const instance = axios.create({
  responseType: 'json',
  headers: baseHeaders
})
const instance2 = axios.create({
  responseType: 'text',
  headers: baseHeaders
})

/////////////
/////////////

const id = '7044BD8CBFA44539B91289386EB05347|1611798043136'
const metas = {
  appName: 'melody',
  appVersion: '4.4.0',
  ksid: 'YTJLNZMTA1MjUzOTA0OTU1MTAxTlVCMkl6dDhQ'
}
const ksid = metas.ksid
const ncp = '2.0.0'
const namespace = 'elm-retry'

const instanceElm = axios.create({
  responseType: 'json',
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh-CN,zh;q=0.9',
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
const instanceElm2 = axios.create({
  baseURL: 'https://httpizza.ele.me/',
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-type': 'application/json;charset=UTF-8',
    origin: 'https://melody-goods.faas.ele.me',
    referer: 'https://melody-goods.faas.ele.me/',
    cookie:
      'ubt_ssid=jjejf45i3g21gq7u9q0qsx7285p26no9_2020-07-23; cna=mN6fF0ZBfUoCAbcM883H0GeQ; _ga=GA1.2.1935531342.1595506439; perf_ssid=k8hpmuq7iwcmfh1w8uk3hlndqmjcbq5n_2020-07-24; ut_ubt_ssid=aw4uycga06hsyjzob32dq8a4qx2e3lsy_2020-08-02; UTUSER=0; crystalTab=FINANCE; ksid=YTJLNZMTA1MjUzOTA0OTU1MTAxTlVCMkl6dDhQ; _m_h5_tk=aae647ac34774822404bcd9b8a80f69c_1611554322007; _m_h5_tk_enc=17539460a6def8769d7f1f25371f91e6; xlly_s=1; tfstk=cY1PBIML37Fzo1OQBQOEV9B6RzpRZHQl-j86E9Lj6PaSaUplikopozXMuetTiLf..; l=eB_OlV6eOjYt6hkSKOfwourza77OSIRAguPzaNbMiOCP_J5p51WRW6MqPbY9C3GVh68kR3uKcXmQBeYBqIcv7r5RSC1woEDmn; isg=BNbWf12rqrO7oKEM5Sh0e-HlJ4zYdxqxLaaiH0A_wrlUA3adqAdqwTzxm5_vqxLJ',
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
    if (config.method == 'post' && config.headers['Content-Type'] != 'application/json')
      config.data = qs.stringify(config.data)
    // console.log(config)
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
instance2.interceptors.request.use(
  config => {
    if (config.method == 'post') config.data = qs.stringify(config.data)
    return config
  },
  err => Promise.reject(err)
)
instance2.interceptors.response.use(
  res => {
    return res.data
  },
  err => Promise.reject(err)
)

// elm
instanceElm.interceptors.request.use(
  config => {
    if (config.method == 'post') {
      const [service, method] = new URL(config.url).searchParams.get('method').split('.')

      config[namespace] = config[namespace] || {}
      config[namespace].data = config.data
      config[namespace].retryCount = config[namespace].retryCount || 0

      config.data = {
        id,
        metas,
        ncp,
        service,
        method,
        params: {
          ...config.data
        }
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
  error => {
    const config = error.config

    if (!config || !config[namespace]) {
      return Promise.reject(error)
    }

    const shouldRetry = /ETIMEDOUT|ECONNRESET/.test(error.code) && config[namespace].retryCount < 3

    if (shouldRetry) {
      config[namespace].retryCount += 1

      console.log('retry...', config[namespace].retryCount)
      return new Promise(resolve =>
        setTimeout(() => resolve(instanceElm({ ...config, data: config[namespace].data })), 600)
      )
    }

    return Promise.reject(error)
  }
)
instanceElm2.interceptors.request.use(
  config => {
    if (config.method == 'post') {
      config[namespace] = config[namespace] || {}
      config[namespace].data = config.data
      config[namespace].retryCount = config[namespace].retryCount || 0

      config.data = {
        ksid,
        ...config.data
      }
    } else if(config.method == 'get') {
      config[namespace] = config[namespace] || {}
      config[namespace].params = config.params
      config[namespace].retryCount = config[namespace].retryCount || 0

      config.params = {
        ksid,
        ...config.params
      }
    }
    // console.log(config)
    return config
  },
  err => Promise.reject(err)
)
instanceElm2.interceptors.response.use(
  res => {
    return Promise.resolve(res.data)
  },
  error => {
    const config = error.config

    if (!config || !config[namespace]) {
      return Promise.reject(error)
    }

    const shouldRetry = /ETIMEDOUT|ECONNRESET/.test(error.code) && config[namespace].retryCount < 3

    if (shouldRetry) {
      config[namespace].retryCount += 1

      console.log('retry...', config[namespace].retryCount)
      return new Promise(resolve =>
        setTimeout(() => resolve(instanceElm({ ...config, data: config[namespace].data, params: config[namespace].params })), 600)
      )
    }

    return Promise.reject(error)
  }
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

function iso(addDay) {
  if (!addDay) return dayjs().toISOString()
  return dayjs()
    .add(addDay, 'day')
    .toISOString()
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

function move(ls, oldPos, newPos) {
  let newLs = [...ls]
  let dE = newLs.splice(oldPos, 1)[0]
  newLs.splice(newPos, 0, dE)
  return newLs
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
    let res = await execRequest(undefined, api, [v], cookie(wmPoiId))
    if (res.totalCount == 0) return searchRace(api, vs, wmPoiId)
    return Promise.resolve(res)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function searchRace2(api, vs, wmPoiId) {
  try {
    let v = vs.shift()
    if (!v) return Promise.reject('search maxed')
    let res = await execRequest(undefined, api, [wmPoiId, v])
    if (res.length == 0) return searchRace(api, vs, wmPoiId)
    return Promise.resolve(res)
  } catch (err) {
    return Promise.reject(err)
  }
}

function b(inst = instance, req, args, headers) {
  return function() {
    return execRequest(inst, req, args, headers)
  }
}

async function a(wmPoiId) {
  try {
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

    // const res = await execRequest(undefined, y.requests.mt['折扣商品/get'], [10085676])
    // const res = await execRequest(undefined, y.requests.mt['折扣商品/sort'], [[{"id":3741533070,"wmPoiId":"10085676","wmSkuId":3824275011,"sortNumber":"2","spuId":3412950683}]])

    // const res = await execRequest(undefined, y.requests.mt['分类列表/get'], [10085676])
    // const res = await execRequest(y.requests['分类列表/sort'], [10085676, 178984094, 1])

    // const res = await execRequest(y.requests['商品列表/get'], [10085676, 178984089])

    // const res = await execRequest(undefined, y.requests.mt['老板推荐/update/state'], [9976196, 0])

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

    // const { productList } = await execRequest(undefined, y.requests.mt['商品列表/search'], [10085676, '炸双皮奶'])
    // const food = productList.find(v => v.name == '炸双皮奶【3个】')
    // const actFood = {
    //   foodKey: 52,
    //   id: 0,
    //   wmPoiId: '10085676',
    //   wmActPolicyId: '1001',
    //   actInfo: { discount: 'NaN', origin_price: 12.8, act_price: '8.8' },
    //   period: '00:00-23:59',
    //   wmSkuId: 3595291980,
    //   weeksTime: '1,2,3,4,5,6,7',
    //   startTime: 1610380800,
    //   endTime: 1627747199,
    //   orderPayType: 2,
    //   orderLimit: '-1',
    //   limitTimeSale: '-1',
    //   itemName: '炸双皮奶【3个】',
    //   sortIndex: 0,
    //   settingType: '1',
    //   chargeType: '0',
    //   wmUserType: 0,
    //   poiUserType: '0',
    //   WmActPriceVo: { originPrice: 12.8, actPrice: '8.8', mtCharge: '0', agentCharge: 0, poiCharge: '4.00' },
    //   autoDelayDays: 0,
    //   spec: '',
    //   priority: 0
    // }

    // console.log(res.data)

    // const fallbackApp = new FallbackApp()
    // let data = await fallbackApp.poi.list()
    // data = data.filter(v => v.poiName.includes('甜品')).map(v => [v.id, y.rules.店铺公告.甜品])
    // await loop(updateShopInfo, [[10085676, y.rules.店铺公告.甜品]], false)
    // const res = await updateShopInfo(10085676, y.rules['店铺公告']['甜品'])
    // console.log(res)

    // const res = await execRequest(undefined, y.requests.mt['公告电话/update'], ['13535410086'], cookie(10085676))
    // const res = await execRequest(instance2, y.requests.mt['商品编辑/get'], [10085676, 3208545315])
    // let pageModel = ''
    // const parser = new htmlparser2.Parser({
    //   onopentag(name, attrs) {
    //     if(name == 'meta' && attrs.name == 'pageModel') {
    //       pageModel = attrs.data
    //     }
    //   }
    // })
    // parser.write(res.data)
    // parser.end()

    // const res = await execRequest(instance3, y.requests.mt['店铺招牌/get'], {}, cookie(-1))
    // let d = res.find(
    //   v => v.signagePicUrl == 'http://p0.meituan.net/business/c666aee02214b357cbb900920c18e02a257037.png'
    // )
    // const res2 = await execRequest(
    //   instance3,
    //   y.requests.mt['店铺招牌/bind'],
    //   [[...d.wmPoiIds, 9976196].join(','), d.wmPoiIds.join(','), d.signageIds.join(',')],
    //   cookie(-1)
    // )
    // console.log(res2)

    /**
     * ELM     ELM      ELM     ELM
     */
    // const res = await execRequest(instanceElm, y.requests.elm['商品列表/search'], [2036923650, '招牌'], xshard(2036923650))

    // const res = await execRequest(instanceElm, y.requests.elm['分类列表/get'], [2065322800])

    // const materials = await execRequest(instanceElm, y.requests.elm['原料列表/get'], [2036923650], xshard(2036923650))
    // const root = { name: 'root', children: materials, leaf: 0 }
    // function find(node, name) {
    //   if (node.children.length == 0) {
    //     if (node.name == name) {
    //       return node
    //     } else {
    //       return null
    //     }
    //   } else {
    //     for (let child of node.children) {
    //       let n = find(child, name)
    //       if(n) return n
    //     }
    //   }
    //   return null
    // }
    // const res = find(root, '水')
    // const cats = await execRequest(instanceElm, y.requests.elm['类目列表/get'], [2036923650], xshard(2036923650))
    // const root = { name: 'root', children: cats.categoryList }
    // function find(node, name, path) {
    //   if (node.children.length == 0) {
    //     if (node.name == name) {
    //       return path
    //     } else {
    //       path.splice(0, path.length)
    //       return null
    //     }
    //   } else {
    //     for (let child of node.children) {
    //       let n = find(child, name, [...path, child])
    //       if (n) return n
    //     }
    //   }
    //   return null
    // }
    // const path = find(root, '手抓饼', [])
    // const categoryModel = path.reduceRight((s, v) => ({...v, children: [s]}))

    // fs.writeFileSync('tools/all.json', JSON.stringify(categoryModel))

    // const res = await execRequest(instanceElm, y.requests.elm['分类列表/get'], [2065322800], xshard(2065322800))

    // const shopinfo = await execRequest(
    //   instance2,
    //   y.requests.mt['门店信息/get'],
    //   {},
    //   { ...y.headers['店铺设置'], Cookie: updateCookie(y.headers['店铺设置'].Cookie, { wmPoiId }) }
    // )

    // let meetTags = false
    // let tags = ''
    // const parser = new htmlparser2.Parser({
    //   onopentag(name, attrs) {
    //     if (name == 'div' && attrs.id == 'J-tag-ids') {
    //       meetTags = true
    //       console.log(attrs)
    //     }
    //   },
    //   ontext(data) {
    //     if (meetTags) {
    //       tags += data
    //     }
    //   },
    //   onclosetag() {
    //     meetTags = false
    //   }
    // })
    // parser.write(shopinfo)
    // parser.end()
    // if (tags == '') return Promise.reject({ err: 'tags null' })

    // const res = await execRequest(undefined, y.requests.mt['店内海报/get'], [9976196])
    // const res = await execRequest(undefined, y.requests.mt['商品列表4/search'], [10085676, '招牌烧仙草'])
    // const res = await execRequest(undefined, y.requests.mt['店铺招牌/get'], {}, cookie(-1))
    // const res = await execRequest(
    //   instanceElm,
    //   y.requests.elm['吃货红包/create'],
    //   [2073319496, 2073319496, date(), date(360), [iso(), iso(360)]],
    //   xshard(2073319496)
    // )
    // const res = await execRequest(
    //   instanceElm,
    //   y.requests.elm['店铺满赠/create'],
    //   [501129234, [{ beginDate: date(), endDate: date(360) }]],
    //   xshard(501129234)
    // )
    // const res = await execRequest(
    //   instanceElm,
    //   y.requests.elm['超级吃货红包/create'],
    //   [501129234, date(), date(360), [date(), date(360)]],
    //   xshard(501129234)
    // )
    // const res = await execRequest(
    //   instanceElm,
    //   y.requests.elm['超值换购/create/activity'],
    //   [501103172, [{ beginDate: date(), endDate: date(360) }]],
    //   xshard(501103172)
    // )
    // const promises = y.rules['超值换购'].map(v =>
    //   execRequest(instanceElm, y.requests.elm['商品列表2/search'], [wmPoiId, v, Math.random()])
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

    let data = await readJson('log/log.json')

    data = data.filter(v => v.err.message == '服务器异常').map(v => v.meta)
    await loop(moveFood, data, false)
    // console.log(res)
  } catch (error) {
    console.error(error)
  }
}

async function updateShopInfo(wmPoiId, bulletin) {
  try {
    const res = await execRequest(
      instance2,
      y.requests.mt['门店信息/get'],
      {},
      { ...y.headers['店铺设置'], Cookie: updateCookie(y.headers['店铺设置'].Cookie, { wmPoiId }) }
    )

    let meetPhone = false
    let phone = ''
    const parser = new htmlparser2.Parser({
      onopentag(name, attrs) {
        if (name == 'div' && attrs.id == 'J-phone-list') {
          meetPhone = true
          console.log(attrs)
        }
      },
      ontext(data) {
        if (meetPhone) {
          phone += data
        }
      },
      onclosetag() {
        meetPhone = false
      }
    })
    parser.write(res)
    parser.end()

    if (phone == '') return Promise.reject({ err: 'phone null' })

    return execRequest(undefined, y.requests.mt['公告电话/update'], [JSON.parse(phone).join('/'), bulletin], {
      ...y.headers['店铺设置'],
      Cookie: updateCookie(y.headers['店铺设置'].Cookie, { wmPoiId })
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function updateFoodCat(shopId, catName) {
  try {
    const res = await execRequest(instanceElm, y.requests.elm['分类列表/get'], [shopId], xshard(shopId))
    const cat = res.find(v => v.name == catName)
    if (!cat) return Promise.reject({ err: 'cat not found' })
    let update = deepmerge(
      cat,
      {
        // dayPartingStick: {
        //   beginDate: date(),
        //   endDate: '2021-07-31',
        //   dateRange: [
        //     dayjs()
        //       .startOf('day')
        //       .toISOString(),
        //     dayjs('2021-07-31').toISOString()
        //   ]
        // },
        dayPartingStick: null,
        isUseDayPartingStick: false
        // name: newCatName
      },
      { arrayMerge: (_, source) => source }
    )
    return execRequest(instanceElm, y.requests.elm['分类列表/update'], [cat.globalId, update], xshard(shopId))
  } catch (e) {
    return Promise.reject(e)
  }
}

async function createFoodCat(shopId, catName) {
  try {
    const res = await execRequest(instanceElm, y.requests.elm['分类列表/get'], [shopId], xshard(shopId))
    const cat = res.find(v => v.name == '店铺公告')
    if (cat) return Promise.reject({ err: 'cat has been created' })
    return execRequest(instanceElm, y.requests.elm['分类创建/create'], [shopId, catName], xshard(shopId))
  } catch (e) {
    return Promise.reject(e)
  }
}

async function moveFood(shopId) {
  try {
    const res = await execRequest(instanceElm, y.requests.elm['分类列表/get'], [shopId], xshard(shopId))
    const cat = res.find(v => v.name == '店铺公告')
    if (!cat) return Promise.reject({ err: 'cat not found' })

    let foods = await Promise.all(
      ['0元吃', '0元购'].map(v =>
        execRequest(instanceElm, y.requests.elm['商品列表/search'], [shopId, v], xshard(shopId))
      )
    )
    foods = foods
      .map(v => v.itemOfName.map(k => k.id).join(','))
      .join(',')
      .split(',')
      .filter(v => v != '')
    return execRequest(instanceElm, y.requests.elm['商品移动/update'], [shopId, cat.id, foods], xshard(shopId))
  } catch (e) {
    return Promise.reject(e)
  }
}

a()

koa.use(cors())
koa.use(
  bodyParser({
    onerror: function(err, ctx) {
      ctx.throw('body parse error', 422)
    }
  })
)

router.post('/fresh/mt', async ctx => {
  try {
    let { userTasks, userRule } = ctx.request.body
    if (!userTasks || !userRule) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await freshMt(userTasks, userRule)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/tests/sync', async ctx => {
  try {
    let { wmPoiId } = ctx.request.body
    if (!wmPoiId) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await testsSync(wmPoiId)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

router.post('/tests/del', async ctx => {
  try {
    let { wmPoiId } = ctx.request.body
    if (!wmPoiId) {
      ctx.body = { e: 'invalid params' }
      return
    }
    const res = await testsDel(wmPoiId)
    ctx.body = { res }
  } catch (e) {
    console.log(e)
    ctx.body = { e }
  }
})

koa.use(router.routes())
// koa.listen(9010, () => console.log('running at 9010'))

async function freshMt(userTasks, userRule) {
  try {
    const { wmPoiId, wmPoiType, wmPoiReducType, sourcePoiId } = userRule

    if (!wmPoiId || !wmPoiType || !wmPoiReducType) return Promise.reject('invalid params')

    const allTasks = [
      {
        name: '下单返券',
        fn: b(undefined, y.requests.mt['下单返券/create'], [wmPoiId, date(), date(365)])
      },
      {
        name: '店内领券',
        fn: b(undefined, y.requests.mt['店内领券/create'], [wmPoiId, unix(), unix(365)])
      },
      {
        name: '收藏有礼',
        fn: b(undefined, y.requests.mt['收藏有礼/create'], [[wmPoiId]])
      },
      {
        name: '代金券包',
        fn: b(undefined, y.requests.mt['代金券包/create'], [unix(), unix(30), [wmPoiId], wmPoiId])
      },
      {
        name: '集点返券',
        fn: b(undefined, y.requests.mt['集点返券/create'], [unix(), unix(90), [wmPoiId].join(',')])
      },
      {
        name: '满减活动',
        fn: async function() {
          try {
            const policy = y.rules['满减活动'][wmPoiReducType].map(([a, b]) => ({
              price: a,
              discounts: [
                {
                  code: 1,
                  type: 'default',
                  discount: b,
                  poi_charge: b,
                  mt_charge: 0,
                  agent_charge: 0
                }
              ]
            }))
            return execRequest(undefined, y.requests.mt['满减活动/create'], [wmPoiId, policy, unix(), unix(365)])
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      {
        name: '超值换购',
        fn: async function() {
          try {
            const promises = y.rules['超值换购'].map(v =>
              execRequest(undefined, y.requests.mt['商品列表2/search'], [wmPoiId, v, Math.random()])
            )
            const goods = await Promise.allSettled(promises)
            const actItems = goods
              .filter(v => v.status == 'fulfilled')
              .slice(0, 3)
              .map(v => v.value[0].groupData[0])
              .map(({ wm_poi_id, id, price, name }) => ({
                list: [`${wm_poi_id}_${id}_${price}`],
                dayLimit: -1,
                orderLimit: '1',
                mtCharge: 0,
                actItemPrice: '6.9',
                itemName: name
              }))
            return execRequest(
              undefined,
              y.requests.mt['超值换购/create'],
              [unix(), unix(365), actItems],
              cookie(wmPoiId)
            )
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      {
        name: '老板推荐',
        fn: async function() {
          try {
            const promises = y.rules['老板推荐'][wmPoiType].map(v =>
              typeof v == 'string'
                ? execRequest(undefined, y.requests.mt['商品列表3/search'], [v], cookie(wmPoiId))
                : searchRace(y.requests.mt['商品列表3/search'], v, wmPoiId)
            )
            let goods = await Promise.allSettled(promises)
            goods = goods
              .filter(v => v.status == 'fulfilled' && v.value.totalCount > 0)
              .map(v => v.value.productList[0])
            return Promise.all([
              execRequest(undefined, y.requests.mt['老板推荐/update/state'], [wmPoiId, 1]),
              execRequest(
                undefined,
                y.requests.mt['老板推荐/update/products'],
                [goods.map(g => g.id).join(',')],
                cookie(wmPoiId)
              )
            ])
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      {
        name: '减配送费',
        fn: async function() {
          try {
            const res = await execRequest(undefined, y.requests.mt['配送范围/get'], {}, cookie(wmPoiId))
            const fee = +res.logisticsPlanDetails[0].periods[0].spAreas[0].shippingFee + 4.1
            const policy = [{ discount: fee, shipping_charge: '0', mt_charge: '0', poi_charge: fee, agent_charge: '0' }]
            const res2 = await execRequest(undefined, y.requests.mt['减配送费/create'], [
              wmPoiId,
              policy,
              unix(),
              unix(365)
            ])
            return Promise.resolve(res2)
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      {
        name: '到店自取',
        fn: b(undefined, y.requests.mt['到店自取/update'], [wmPoiId], y.headers['店铺设置'])
      },
      {
        name: '极速退款',
        fn: b(undefined, y.requests.mt['极速退款/close'], [wmPoiId], y.headers['店铺设置'])
      },
      {
        name: '青山公益',
        fn: b(undefined, y.requests.mt['青山公益/update'], [wmPoiId], y.headers['总店'])
      },
      {
        name: '营业设置',
        fn: b(
          undefined,
          y.requests.mt['营业设置/update'],
          {},
          { ...y.headers['店铺设置'], Cookie: updateCookie(y.headers['店铺设置'].Cookie, { wmPoiId }) }
        )
      },
      {
        name: '开具发票',
        fn: b(
          undefined,
          y.requests.mt['开具发票/update'],
          {},
          { ...y.headers['店铺设置'], Cookie: updateCookie(y.headers['店铺设置'].Cookie, { wmPoiId }) }
        )
      },
      {
        name: '门店公告',
        fn: async function() {
          return updateShopInfo(wmPoiId, y.rules['店铺公告'][wmPoiType])
        }
      },
      {
        name: '折扣商品',
        fn: async function() {
          try {
            if (!sourcePoiId) return Promise.reject('invalid params')
            let acts = await execRequest(undefined, y.requests.mt['折扣商品/get'], [sourcePoiId])
            const actsT = await execRequest(undefined, y.requests.mt['折扣商品/get'], [wmPoiId])
            acts = acts
              .filter(item => !(item.priority === 1200 || item.priority === 1400 || item.priority === 1600))
              .filter(item => !actsT.find(k => k.itemName == item.itemName))
              .reverse()
            let results = []
            for (let item of acts) {
              try {
                const searches = await execRequest(undefined, y.requests.mt['商品列表/search'], [
                  wmPoiId,
                  item.itemName
                ])
                const food = searches.productList.find(v => v.name == item.itemName)
                if (!food) {
                  results.push({ name: item.itemName, status: 'fail', reason: `name not matched` })
                  continue
                }
                let policy = keep(item, [
                  'wmActPolicyId',
                  'itemName',
                  'period',
                  'weeksTime',
                  'orderPayType',
                  'orderLimit',
                  'settingType',
                  'chargeType',
                  'wmUserType',
                  'poiUserType',
                  'autoDelayDays',
                  'spec',
                  'priority'
                ])
                policy = {
                  ...policy,
                  limitTimeSale: '-1',
                  actInfo: JSON.parse(item.actInfo),
                  WmActPriceVo: JSON.parse(item.charge),
                  foodKey: 1,
                  id: 0,
                  sortIndex: 0,
                  wmPoiId,
                  wmSkuId: food.wmProductSkus[0].id,
                  startTime: dayjs()
                    .startOf('day')
                    .unix(),
                  endTime: dayjs('2021-07-31').unix()
                }
                const r = await execRequest(undefined, y.requests.mt['折扣商品/create'], [wmPoiId, [policy]])
                console.log(r)
                results.push({ name: item.itemName, status: 'succ', value: r })
              } catch (e) {
                console.log(e)
                results.push({ name: item.itemName, status: 'fail', reason: e })
              }
            }
            return Promise.resolve(results)
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      {
        name: '品类头像',
        fn: async function() {
          try {
            const { poiPicUrl } = await execRequest(
              undefined,
              y.requests.mt['门店头像/get'],
              {},
              { ...y.headers['店铺设置'], Cookie: updateCookie(y.headers['店铺设置'].Cookie, { wmPoiId }) }
            )

            const newTags = await execRequest(undefined, y.requests.mt['经营品类/get'], [wmPoiId], {
              ...y.headers['店铺设置'],
              Cookie: updateCookie(y.headers['店铺设置'].Cookie, { wmPoiId })
            })
            const root = { name: 'root', children: newTags, is_leaf: 0 }
            function find(node, name) {
              if (node.is_leaf) {
                if (node.name == name) {
                  return node
                } else {
                  return null
                }
              } else {
                for (let child of node.children) {
                  let n = find(child, name)
                  if (n) return n
                }
              }
              return null
            }
            let pri = find(root, y.rules['经营品类'][wmPoiType][0])
            let sec = find(root, y.rules['经营品类'][wmPoiType][1])
            return execRequest(
              undefined,
              y.requests.mt['品类头像/update'],
              [`${pri.id},${sec.id}`, poiPicUrl, y.rules['店铺头像'][wmPoiType]],
              { ...y.headers['店铺设置'], Cookie: updateCookie(y.headers['店铺设置'].Cookie, { wmPoiId }) }
            )
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      {
        name: '店内海报',
        fn: async function() {
          try {
            const promises = y.rules['老板推荐'][wmPoiType].map(v =>
              typeof v == 'string'
                ? execRequest(undefined, y.requests.mt['商品列表4/search'], [wmPoiId, v])
                : searchRace2(y.requests.mt['商品列表4/search'], v, wmPoiId)
            )
            let goods = await Promise.allSettled(promises)
            goods = goods.filter(v => v.status == 'fulfilled' && v.value.length > 0).map(v => v.value[0])
            return execRequest(
              undefined,
              y.requests.mt['店内海报/create'],
              [`${y.rules['店内海报'][wmPoiType]}?t=${dayjs().valueOf()}`, goods.map(g => g.id).join(',')],
              cookie(wmPoiId)
            )
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      {
        name: '品牌故事',
        fn: async function() {
          try {
            const stories = await execRequest(undefined, y.requests.mt['品牌故事/get'], {}, cookie(-1))
            const story = stories.find(v => v.id == y.rules['品牌故事'][wmPoiType])
            if (!story) return Promise.reject({ err: 'story not found' })
            if (story.wmPoiIdList.includes(parseInt(wmPoiId))) return Promise.reject({ err: 'story has been binded' })
            let wmPoiIdListStr = [...story.wmPoiIdList, wmPoiId].join(',')
            let brandStoryForBigPicResListStr = story.brandStoryForBigPicResList
            let brandStoryForSmallPicResListStr = story.brandStoryForSmallPicResList
            return execRequest(
              undefined,
              y.requests.mt['品牌故事/update'],
              {
                ...omit(story, ['wmPoiIdList', 'brandStoryForBigPicResList', 'brandStoryForSmallPicResList']),
                wmPoiIdListStr,
                brandStoryForBigPicResListStr,
                brandStoryForSmallPicResListStr
              },
              cookie(-1)
            )
          } catch (e) {
            return Promise.reject(e)
          }
        }
      },
      {
        name: '店铺招牌',
        fn: async function() {
          try {
            const signages = await execRequest(undefined, y.requests.mt['店铺招牌/get'], {}, cookie(-1))
            const signage = signages.find(v => v.signagePicUrl == y.rules['店铺招牌'])
            if (!signage) return Promise.reject({ err: 'signage not found' })
            if (signage.wmPoiIds.includes(parseInt(wmPoiId))) return Promise.reject({ err: 'signage has been binded' })
            let newPoiIds = [...signage.wmPoiIds, wmPoiId].join(',')
            return execRequest(
              undefined,
              y.requests.mt['店铺招牌/bind'],
              [newPoiIds, signage.wmPoiIds.join(','), signage.signageIds.join(',')],
              {
                ...cookie(-1),
                Referer: `https://waimaieapp.meituan.com/decoration/v2/signage${new URL(baseHeaders.Referer).search}`,
                'Content-Type': 'application/json'
              }
            )
          } catch (e) {
            return Promise.reject(e)
          }
        }
      }
    ]

    let tasks = allTasks.filter(t => userTasks.map(u => u.name).includes(t.name))
    let results = []
    for (let t of tasks) {
      try {
        let value = await t.fn()
        results.push({ name: t.name, status: 'succ', value })
      } catch (e) {
        results.push({ name: t.name, status: 'fail', reason: e })
      }
    }

    console.log(results)
    return Promise.resolve(results)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function freshElm() {
  try {
    const y = readYaml('tools/all.yaml')

    const res = await execRequest(instanceElm, y.requests.elm['分类列表/get'])
  } catch (e) {
    console.error(e)
  }
}

async function testsSync(wmPoiId) {
  const fallbackApp = new FallbackApp(wmPoiId)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice(0, true)
    if (ok) {
      console.log(ok)
      return Promise.resolve({ ok })
    }
    return Promise.reject('sync failed')
  } catch (e) {
    return Promise.reject(e)
  }
}

async function testsDel(wmPoiId) {
  const fallbackApp = new FallbackApp(wmPoiId)

  try {
    let tags = await fallbackApp.food.listTags()
    tags = tags.filter(v => v.name.includes('店铺公告'))
    let results = []
    for (let tag of tags) {
      try {
        if (wmPoiId == 9470231) continue
        if (!/店铺公告\d+/.test(tag.name)) continue
        const tests = await fallbackApp.food.listFoods(tag.id)
        if (tests.length > 0) {
          const skuIds = tests.map(v => v.wmProductSkus.map(k => k.id).join(','))
          const res = await fallbackApp.food.batchDeleteFoods(skuIds)
          const res2 = await fallbackApp.food.delTag(tag.id)
          results.push({ tests: res, tag: res2 })
        }
      } catch (err) {
        return Promise.reject({ err })
      }
    }
    return Promise.resolve(results)
  } catch (e) {
    return Promise.reject(e)
  }
}
