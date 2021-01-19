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

const singleCookie =
  'acctId=23262521; classRoomTips=true; bmm-uuid=8187924a-26c6-0a7e-5c0f-aaf09ad861cf; bizad_second_city_id=440300; bizad_cityId=440306; bizad_third_city_id=440306; wmPoiName=%E5%96%9C%E4%B8%89%E5%BE%B7%E7%94%9C%E5%93%81%E2%80%A2%E6%89%8B%E5%B7%A5%E8%8A%8B%E5%9C%86%EF%BC%88%E6%96%B0%E5%AE%89%E5%BA%97%EF%BC%89; _ga=GA1.2.1511021963.1597473654; _hc.v=c9793375-e9a8-7952-72a7-e404fd7ad70a.1602157773; _lxsdk=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; _lxsdk_cuid=173796b978082-0920d6b94f4f16-b7a1334-144000-173796b97817c; uuid=16db610009dfc3c606c8.1602213490.1.0.0; igateApp=shangdan_qualification; __mta=146715147.1599578598056.1610506443155.1610506443174.10; token=0ZYJ8xEhxXGWervc28-KnTF_bRkAfHLEuU1ywvC-dEzs*; bsid=IkuK4w3u1sgGWZWfMf1kCTboJJuA-VgfcfmILhN1pHTxJV-mqvVC9WDWzEfiqXe02dwUdOs3GiBDPgxu1gWBuw; wmPoiId=10085676; JSESSIONID=18jcolmlpy6c2hjxpb63zd0b5; _lxsdk_s=1770462cca8-e55-b42-45%7C23262521%7C16'

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
    if (config.method == 'post') config.data = qs.stringify(config.data)
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

    // data = data.map(v=>[v.id, y])

    // await loop(updateShopInfo, [[10085676, y.rules.店铺公告.甜品]], false)

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

    // const tags = await execRequest(undefined, y.requests.mt['经营品类/get'], [10085676])
    // const root = { name: 'root', children: tags, is_leaf: 0 }
    // function find(node, name) {
    //   if (node.is_leaf) {
    //     if (node.name == name) {
    //       return node
    //     } else {
    //       return null
    //     }
    //   } else {
    //     for (let child of node.children) {
    //       let n = find(child, name)
    //       if (n) return n
    //     }
    //   }
    //   return null
    // }
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

// a(9470231)

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
koa.listen(9010, () => console.log('running at 9010'))

async function freshMt(userTasks, userRule) {
  try {
    const { wmPoiId, wmPoiType, sourcePoiId } = userRule

    if (!wmPoiId || !wmPoiType) return Promise.reject('invalid params')

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
            const policy = y.rules['满减活动'][wmPoiType].map(([a, b]) => ({
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
