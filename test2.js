import App from './index.js'
import FallbackApp, { loop, wrap, readJson, readXls } from './fallback/fallback_app.js'
import log from './log/log.js'
import dayjs from 'dayjs'
import xls2json from 'xls-to-json'
import util from 'util'
import fs from 'fs'
import axios from 'axios'
const axls2Json = util.promisify(xls2json)
import sleep from 'sleep-promise'
import schedule from 'node-schedule'
import flatten from 'flatten'
import knx from '../50/index.js'
import pLimit from 'p-limit'
import { keepBy, combineArray, isSameArrayBy, mergeObjs, includesBy, diffArrayBy, calcPrice } from './utils/util.js'

async function test_reduction() {
  try {
    // const id = 9470231
    // const name = '草莓脏脏茶'
    // const price = 13.4
    // const boxPrice = 1.2
    // const updateFoodPriceRes = await updateFoodPrice(id, name, price)

    // let skus = [{
    //   price,
    //   wmProductLadderBoxPrice: { ladder_num: 1, ladder_price: boxPrice, status: 1 }
    // }]
    // const batchUpdateFoodSkusRes = await batchUpdateFoodSkus(id, name, skus)
    // console.log(batchUpdateFoodSkusRes)

    // const fallbackApp = new FallbackApp(id)
    // const delReductionRes = await fallbackApp.act.reduction.delete()
    // console.log(delReductionRes)

    let policyDetail = [
      {
        discounts: [{ code: 1, discount: 14, poi_charge: 14, agent_charge: 0, type: 'default', mt_charge: 0 }],
        price: 16
      },
      {
        discounts: [{ code: 1, discount: 21, poi_charge: 21, agent_charge: 0, type: 'default', mt_charge: 0 }],
        price: 32
      },
      {
        discounts: [{ code: 1, discount: 32, poi_charge: 32, agent_charge: 0, type: 'default', mt_charge: 0 }],
        price: 48
      },
      {
        discounts: [{ code: 1, discount: 44, poi_charge: 44, agent_charge: 0, type: 'default', mt_charge: 0 }],
        price: 88
      },
      {
        discounts: [{ code: 1, discount: 58, poi_charge: 58, agent_charge: 0, type: 'default', mt_charge: 0 }],
        price: 158
      }
    ]

    // let e = await axls2Json({
    //   input: `plan/12月8号批量改贡茶价格.xlsx`,
    //   sheet: 'Sheet4',
    //   output: `plan/12月8号批量改贡茶价格.xlsx.json`
    // })
    // let shopIds = Array.from(new Set(e.map(v => v.id)))
    let shopIds = `10177204
    10084390
    9569351
    9452709
    10328119
    9401067
    10289760
    7882136
    9206400
    9191424
    8975165
    9771558
    9325142
    9976196
    9820232
    10231556`
      .split('\n')
      .map(v => v.trim())
    let e = JSON.parse(fs.readFileSync('plan/12月8号批量改贡茶价格.xlsx.json'))

    let e_name = Array.from(new Set(e.map(v => v.菜名)))
    e = e_name.map(name => e.find(v => v.菜名 == name))

    for (let id of shopIds) {
      try {
        console.log(id)
        const saveReductionRes = await saveReduction(id, null, null, policyDetail)
        console.log(saveReductionRes)

        for (let p of e) {
          const name = p.菜名
          const price = 14.8

          console.log(id, name, price)
          try {
            const updateFoodPriceRes = await updateFoodPrice(id, name, price)
            console.log(updateFoodPriceRes)
            // await sleep(8000)
          } catch (err) {
            console.error(err)
            log({ shop: { id, name, price }, err })
          }
        }

        console.log()
      } catch (err) {
        console.error(err)
        log({ shop: { id }, err })
      }
    }
  } catch (err) {
    console.error(err)
    log({ err })
  }
}

async function updateFoodPrice(cookie, id, name, price) {
  // const app = new App(id)
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const foodWillUpdatePrice = await fallbackApp.food.find(name)
    const foodUpdatePriceRes = await fallbackApp.food.updatePrice(foodWillUpdatePrice.wmProductSkus[0].id, price)
    const foodUpdatedPriceRes = await fallbackApp.food.find(name)
    return {
      ...foodUpdatePriceRes,
      foodUpdatedPrice: foodUpdatedPriceRes.wmProductSkus.map(v => v.price).join(',')
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateFoodBoxPrice(cookie, id, name, catName, boxPrice) {
  // const app = new App(id)
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const food = await fallbackApp.food.find(name, catName)
    const skus = food.wmProductSkus

    const { ok } = await fallbackApp.food.setHighBoxPrice2(Math.max(...skus.map(sku => sku.boxPrice)), skus.length)
    if (ok) {
      const updateBoxPriceRes = await fallbackApp.food.batchUpdateBoxPrice(
        food.wmProductSkus.map(v => v.id),
        boxPrice
      )
      return Promise.resolve(updateBoxPriceRes)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function batchUpdateFoodSkus(cookie, id, name, catName, skus) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const food = await fallbackApp.food.find(name, catName)

    if (food.wmProductSkus.length >= skus.length)
      skus = skus.map((sku, i) => {
        return {
          spec: sku.spec ?? `${i}`,
          weight_unit: sku.weight_unit ?? food.wmProductSkus[i].weightUnit,
          weight: sku.weight ?? food.wmProductSkus[i].weight,
          price: sku.price ?? food.wmProductSkus[i].price,
          stock: sku.stock ?? food.wmProductSkus[i].stock,
          unifiedPackagingFee: 2,
          minOrderCount: sku.minOrderCount,
          wmProductLadderBoxPrice:
            sku.wmProductLadderBoxPrice ??
            food.wmProductSkus[i].wmProductLadderBoxPrice ??
            {
              ladder_num: 1,
              ladder_price: food.wmProductSkus[i].boxPrice,
              status: 1
            }
        }
      })
    else
      skus = skus.map((sku, i) => {
        return {
          spec: sku.spec ?? `${i}`,
          weight_unit: sku.weight_unit ?? food.wmProductSkus[0].weightUnit,
          weight: sku.weight ?? food.wmProductSkus[0].weight,
          price: sku.price ?? food.wmProductSkus[0].price,
          stock: sku.stock ?? food.wmProductSkus[0].stock,
          unifiedPackagingFee: 2,
          minOrderCount: sku.minOrderCount,
          wmProductLadderBoxPrice:
            sku.wmProductLadderBoxPrice ??
            food.wmProductSkus[0].wmProductLadderBoxPrice ??
            {
              ladder_num: 1,
              ladder_price: food.wmProductSkus[0].boxPrice,
              status: 1
            }
        }
      })
    // console.log(food.wmProductSkus)

    const { ok } = await fallbackApp.food.setHighBoxPrice2(
      Math.max(...skus.map(sku => sku.wmProductLadderBoxPrice?.ladder_price)), skus.length)
    if (ok) {
      const batchUpdateSkusRes = await fallbackApp.food.batchUpdateSkus(
        [food.id],
        food.wmProductSkus.map(v => v.id),
        skus
      )
      return batchUpdateSkusRes
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    console.log('update skus')
    return Promise.reject(err)
  }
}

async function saveReduction(cookie, id, startTime, endTime, policyDetail) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const reductionRes = await fallbackApp.act.reduction.list()
    let reduction = reductionRes.list.find(v => v.status == 1)

    let poiPolicy = undefined
    if (reduction) {
      startTime = startTime || reduction.startTime
      endTime = endTime || reduction.endTime
      reduction.policy = JSON.parse(reduction.policy)
      poiPolicy = {
        ...reduction.policy,
        policy_detail: policyDetail
      }
      const saveReductionRes = await fallbackApp.act.reduction.save(reduction.id, startTime, endTime, poiPolicy)
      return saveReductionRes
    }
    // else {
    //   // const delReductionRes = await fallbackApp.act.reduction.delete()
    //   startTime = dayjs()
    //     .startOf('day')
    //     .unix()
    //   endTime = dayjs()
    //     .startOf('day')
    //     .add(365, 'day')
    //     .unix()
    //   poiPolicy = {
    //     online_pay: 1,
    //     policy_detail: policyDetail
    //   }
    //   const saveReductionRes = await fallbackApp.act.reduction.save(null, startTime, endTime, poiPolicy)
    //   return Promise.resolve(saveReductionRes)
    // }
    // console.log(poiPolicy)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function delTradein(cookie, id, name) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const trade = await fallbackApp.act.tradeIn.find(name)
    const delTradeinRes = await fallbackApp.act.tradeIn.delete([trade.id])
    return delTradeinRes
  } catch (err) {
    return Promise.reject(err)
  }
}

async function delAct(cookie, id, spuId) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const actListRes = await fallbackApp.act.list()
    const actListWillDel = actListRes.filter(act => act.spuId == spuId)
    const actIds = actListWillDel.map(act => act.id)
    console.log('actIds', actIds)
    if (actIds.length == 0) return { noAct: true }
    const actDelRes = await fallbackApp.act.delete(actIds)
    return Promise.resolve({
      actDelRes,
      actPrice: JSON.parse(actListWillDel[0].actInfo).act_price,
      orderLimit: actListWillDel[0].orderLimit,
      sortIndex: actListWillDel[0].sortIndex,
      sortNumber: actListWillDel[0].sortNumber
    })
  } catch (err) {
    console.error('delAct')
    if (err.msg == '活动不存在') return Promise.resolve({ noAct: true })
    return Promise.reject(err)
  }
}

async function createAct(cookie, id, name, catName, actPrice, orderLimit = -1, sortIndex = 0, sortNumber = 1) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const foodWillCreateAct = await fallbackApp.food.find(name, catName)
    console.log(JSON.stringify(foodWillCreateAct))
    const wmSkuId = foodWillCreateAct.wmProductSkus[0].id
    const originPrice = foodWillCreateAct.wmProductSkus[0].price

    const actCreateRes = await fallbackApp.act.create(wmSkuId, name, originPrice, actPrice, orderLimit, sortIndex, sortNumber)
    const foodCreatedActRes = await fallbackApp.act.find(name)

    console.log(foodCreatedActRes)
    return Promise.resolve({
      ...actCreateRes.map(actC => actC.result),
      foodCreatedAct: {
        ...JSON.parse(foodCreatedActRes.actInfo),
        orderLimit: foodCreatedActRes.orderLimit
      }
    })
  } catch (err) {
    console.error('createAct')
    console.error(err)
    return Promise.reject(err)
  }
}

async function updateAct(cookie, id, name, actPrice) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const foodWillUpdateAct = await fallbackApp.food.find(name)
    const actWillUpdate = await fallbackApp.act.find(name)

    const spuId = foodWillUpdateAct.id
    const wmSkuId = foodWillUpdateAct.wmProductSkus[0].id
    const originPrice = foodWillUpdateAct.wmProductSkus[0].price
    const actId = actWillUpdate.id
    const orderLimit = actWillUpdate.orderLimit

    const actUpdateRes = await fallbackApp.act.updateActPrice(
      spuId,
      wmSkuId,
      name,
      actId,
      originPrice,
      actPrice,
      orderLimit
    )
    const foodUpdatedActRes = await fallbackApp.act.find(name)
    return {
      ...actUpdateRes.map(act => act.result),
      foodUpdatedAct: {
        ...JSON.parse(foodUpdatedActRes.actInfo),
        orderLimit: foodUpdatedActRes.orderLimit
      }
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

async function logActs(cookie, id) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const data = await fallbackApp.act.list()
    const res = await knx('test_mt_acts_').insert(
      data.map(v => ({
        wmPoiId: id,
        act_str: JSON.stringify({ ...v, charge: JSON.parse(v.charge), actInfo: JSON.parse(v.actInfo) })
      }))
    )
    return Promise.resolve(res)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateActTime(cookie, id, act_str) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    let data = JSON.parse(act_str)
    let poiPolicy = {
      online_pay: 0,
      foods: [
        {
          ...data,
          startTime: dayjs()
            .startOf('day')
            .unix(),
          endTime: dayjs('2021-07-31').unix(),
          WmActPriceVo: data.charge
        }
      ]
    }
    return fallbackApp.act.save_(poiPolicy)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_price() {
  // let e = await axls2Json({
  //   input: `-- 美团单折扣商品起送查询2(2).xlsx`,
  //   sheet: 'Sheet1',
  //   output: `-- 美团单折扣商品起送查询2(2).xlsx.json`
  // })
  let e = JSON.parse(fs.readFileSync('plan/12月8号批量改贡茶价格.xlsx.json'))
  let shopIds = Array.from(new Set(e.map(v => v.id)))
  let cont = true
  for (let shop of e) {
    try {
      const id = shop.wmpoiid
      const name = shop.商品
      const price = shop.列1
      const actPrice = parseFloat(shop.折扣价)
      const minOrder = parseInt(shop.起购数)
      const orderLimit = minOrder >= 2 || actPrice <= 2.0 ? 1 : -1
      const delActRes = await delAct(id, name)
      console.log(delActRes)
      const updateFoodPriceRes = await updateFoodPrice(id, name, price)
      console.log(updateFoodPriceRes)
      const createActRes = await createAct(id, name, actPrice, orderLimit)
      console.log(createActRes)
      await sleep(6000)
    } catch (err) {
      console.error(err)
    }
  }
}

async function test_act(cookie) {
  const fallbackApp = new FallbackApp(null, cookie)

  try {
    const poiList = await fallbackApp.poi.list()
    for (let shop of poiList) {
      if (shop.id == 10603386) continue
      try {
        const id = shop.id
        const name = '热狗肠1根【粉丝福利，单点不送】'
        const actPrice = 0.1
        const orderLimit = 1
        console.log(shop.id, shop.poiName)
        const createActRes = await createAct(id, name, actPrice, orderLimit)
        console.log(createActRes)
        // await sleep(6000)
      } catch (err) {
        console.error(err)
        log({ shop: { id: shop.id, name: shop.poiName }, err })
      }
    }
  } catch (err) {
    console.error(err)
  }
}

async function createTest(cookie, id, ti) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    // 店铺公告 门店公告 不要下单 别点了
    const tag = await fallbackApp.food.searchTag(`店铺公告${ti}`)
    let c = []
    for (let i = 0; i < 500; i++) {
      try {
        let r = await fallbackApp.food.createTestFood(tag.id, tag.name, `测试${i}`)
        console.log(i)
        c.push(r)
      } catch (error) {
        console.error(error)
      }
    }
    return Promise.resolve(c)
    // const tag = await fallbackApp.food.
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateImg(cookie, id, spuId, newUrl) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const foodUpdateImgRes = await fallbackApp.food.updateImg(spuId, newUrl)
    return Promise.resolve(foodUpdateImgRes)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateImg2(name, newUrl) {
  try {
    let [data, _] = await knx.raw(
      `SELECT * FROM foxx_food_manage f
       LEFT JOIN foxx_shop_reptile r ON f.wmpoiid = r.wmpoiid
       WHERE reptile_type LIKE '%贡茶%' AND date = CURDATE() AND  name  LIKE '%${name}%'`
    )
    data = data.map(v => ({
      id: v.wmpoiid,
      foodId: v.productId,
      newUrl
    }))
    return Promise.all(data.map(v => new FallbackApp(v.id).food.updateImg(v.foodId, v.newUrl)))
    // const foodUpdateImgRes = await fallbackApp.food.updateImg(foodId, newUrl)
    // return Promise.resolve(foodUpdateImgRes)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateImg3(cookie, id, name, catName, newUrl) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const food = await fallbackApp.food.find(name, catName)
    const foodUpdateImgRes = await fallbackApp.food.updateImg(food.id, newUrl)
    return Promise.resolve(foodUpdateImgRes)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateUnitC(cookie, id, name, catName, weight, weightUnit) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    let { ok } = await fallbackApp.food.setHighBoxPrice2()
    let results = {}
    if (ok) {
      const delActRes = await delAct(id, name)
      results.delActRes = delActRes
      await sleep(1500)
      results.saveRes = await fallbackApp.food.save2(name, catName, null, null, null, null, parseInt(weight), weightUnit)
      if (!delActRes.noAct) {
        await sleep(2000)
        const createActRes = await createAct(id, name, catName, delActRes.actPrice, delActRes.orderLimit)
        results.createActRes = createActRes
      }
      return results
    } else return Promise.reject('sync failed')
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_updateImg() {
  try {
    // let ims = await readJson('image/ims.json')
    // ims = ims.filter(v=>v.name == '红豆沙' || v.name == '绿豆沙')
    // for (let im of ims) {
    //   console.log(im.name)
    //   let [data, _] = await knx.raw(
    //     `SELECT * FROM foxx_food_manage f
    //      LEFT JOIN foxx_shop_reptile r ON f.wmpoiid = r.wmpoiid
    //      WHERE date = CURDATE() AND  name  LIKE '%${im.name.replace('.jpg', '')}%' AND f.name NOT LIKE '%+%' AND r.reptile_type LIKE '%贡茶%'`
    //   )

    //   data = data.map(v => [v.cookie, v.wmpoiid, v.productId, im.url])
    //   await loop(updateImg, data, false)
    // }
    // let data = ['wpush_server_url=wss://wpush.meituan.com; _lxsdk_cuid=17a4b78eccec8-08580c3eff5837-3373266-1fa400-17a4b78eccfc8; _lxsdk=17a4b78eccec8-08580c3eff5837-3373266-1fa400-17a4b78eccfc8; device_uuid=!059131b1-62ec-4243-a602-da4b74c1bc30; uuid_update=true; brandId=-1; isOfflineSelfOpen=0; existBrandPoi=true; newCategory=false; cityId=440300; provinceId=440000; pushToken=0EKVm_FgSbuhBsWTmxT5tJtNkR_k6WyjFFrWfgy6VWII*; wmPoiName=%E5%8F%A4%E5%BE%A1%E8%B4%A1%E8%8C%B6%E2%97%8F%E6%89%8B%E6%8A%93%E9%A5%BC%E2%97%8F%E5%B0%8F%E5%90%83%EF%BC%88%E4%B8%89%E5%85%83%E9%87%8C%E5%BA%97%EF%BC%89; logistics_support=1; shopCategory=food; acctId=84600857; token=0JZjdaVqqUo_XaG-fL8AX9ljtVRsO4ScrTiU22gmNHFw*; wmPoiId=10453345; city_id=110105; isChain=0; ignore_set_router_proxy=false; region_id=1000110100; region_version=1605514847; bsid=13Ssw176KD0wYwPzlR2Cs9SYNQPPRtvosb04SCW0pG0hw295xQu8rNFRpFySpqdE8m2fYZGmKS1_oHeAJOdAcg; city_location_id=110100; location_id=110105; set_info=%7B%22wmPoiId%22%3A10453345%2C%22region_id%22%3A%221000110100%22%2C%22region_version%22%3A1605514847%7D; JSESSIONID=2gr2ge3gwl8wvn0yzcs0dzk7; setPrivacyTime=2_20210628; logan_session_token=59yrg10px1mj7yutgw4d; _lxsdk_s=17a503108dd-13f-26f-871%7C23262521%7C25',
    //   10453345, 3636311516, 'http://p0.meituan.net/wmproduct/a0f32026f68806f6ac3393affc3eb8c02678017.gif']
    // console.log(await updateImg(...data))


    // await loop(
    //   updateImg2,
    //   ims.map(v => [v.name.replace('.jpg', ''), v.url])
    // )
    // let [data, _] = await knx.raw(
    //   `SELECT * FROM foxx_food_manage f
    //   LEFT JOIN foxx_shop_reptile r ON f.wmpoiid = r.wmpoiid
    //   WHERE f.wmpoiid = 11267829 AND f.date = CURDATE()`
    // )
    let cookie = await cookieMtRedis()
    let data = await readXls('plan/8-8更换产品图-双打柠檬红茶.xlsx', '美团')
    data = data.map(v => [
      cookie,
      v.wmpoiid,
      v.productId,
      'http://p1.meituan.net/wmproduct/6abf8e62c8ae61bf882c024fa22f9c93210507.jpg'
    ])
    await loop(updateImg, data, false)
  } catch (err) {
    console.log(err)
  }
}

async function test_updateUnitC() {
  try {
    let data = await readXls('plan/美团商品规格(1)(1).xlsx', 'Sheet1')
    data = data.map((v, i) => [v.wmpoiid, v.name, v.tagName, v.weight, v.weightUnit, i])
    await loop(updateUnitC, data, false, { test: delFoods })
  } catch (err) {
    console.log(err)
  }
}

async function updateUnit(cookie, id, name, unit) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice(0, true)
    if (ok) {
      const res = await fallbackApp.food.save(name, null, unit)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateDesc(cookie, id, name, catName, desc) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      const res = await fallbackApp.food.save2(name, catName, null, null, desc)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateLabels(cookie, id, name, catName, labels) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      const res = await fallbackApp.food.save2(name, catName, null, null, null, null, null, null, labels)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updatePvs(cookie, id, name, catName, pvs) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      const res = await fallbackApp.food.save2(name, catName, null, null, null, null, null, null, null, pvs)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateAttrs(cookie, id, name, attrs) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    // const { ok } = await fallbackApp.food.setHighBoxPrice(0, true)
    if (true) {
      const res = await fallbackApp.food.save(name, null, null, null, attrs)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateAttrs2(cookie, id, name, catName, attrs) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      // const food = await fallbackApp.food.find(name, catName)
      // if (food.wmProductSkus.length == 1) {
      //   const sku = food.wmProductSkus[0]
      //   let box = sku.wmProductLadderBoxPrice ?? { "status": 1, "ladder_num": sku.boxNum ?? 1, "ladder_price": sku.boxPrice ?? 1 }
      //   let stock = sku.wmProductStock ?? { "id": 0, "stock": sku.stock ?? "-1", "max_stock": -1, "auto_refresh": 1 }
      //   const delActRes = await delAct(cookie, id, food.id)
      //   console.log(delActRes)
      //   const res = await fallbackApp.food.batchUpdateSaleAttr(food.id, attrs, box, stock)
      //   const createActRes = await createAct(cookie, id, name, catName, delActRes.actPrice, delActRes.orderLimit, delActRes.sortIndex, delActRes.sortNumber)
      //   console.log(createActRes)
      //   return res
      // }

      const res = await fallbackApp.food.save2(name, catName, attrs)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

const decodeSpuAttrs = (str) => {
  const value = (s, p) => {
    return { "name": p.name, "name_id": 0, "value": s, "value_id": 0, "price": 0, "no": p.no, "mode": 1, "value_sequence": p.value_sequence, "weight": 0, "weightUnit": null, "sell_status": 0 }
  }
  const arr_value = (s, p) => {
    return s.split('#').map((v, i) => value(v, { ...p, value_sequence: i + 1 }))
  }
  const attr = (s, p) => {
    let [name, ...values] = s.split('#')
    return arr_value(values.join('#'), { name, no: p.no })
  }
  const arr_attr = (s) => {
    return s.split('##').filter(a => a != '').map((a, i) => attr(a, { no: i + 1 })).flat()
  }

  if (str == null) return null
  if (typeof str == 'object') return str
  if (typeof str == 'string') {
    // if (isJson(str)) {
    //   return JSON.parse(str)
    // }
    if (str == '' || /\s+/.test(str)) return []
    return arr_attr(str)
  }
}

async function test_updateAttrs2() {
  try {
    let attrs = [] // { name: '温度', values: ['冷', '温热'] }
    // let [data,_] = await knx.raw(`SELECT * FROM foxx_food_manage f WHERE date = CURDATE() AND name LIKE '%杨枝甘露%'`)
    // let data = await readJson('log/log.json')
    let cookie = await cookieMtRedis()
    let data = await readXls('plan/8-2美团商品规格修改2.xlsx', 'Sheet1')
    // let data = await readJson('log/log.json')
    // console.log(data)
    // data = data.slice(data.length - 2)
    data = data.map((v, i) => [cookie, v.门店ID, v.商品, v.分类, decodeSpuAttrs(v.修改后的规格)])
    // data = data.map(v => v.meta)

    await loop(updateAttrs2, data, false, { test: delFoods })
    // const limit = pLimit(5)
    // await Promise.all(
    //   data.map(d => limit(() => wrap(updateAttrs2, d)))
    // )
  } catch (e) {
    console.error(e)
  }
}

async function test_testFood() {
  let data = [1, 2, 3, 4, 5, 6, 7].map(v => [9620939, v])
  await loop(createTest, data, false)
}

async function cookieMtRedis() {
  try {
    const url = 'http://192.168.3.3:10002/cookie'
    const res = (await axios.get(url)).data
    if (!res.ok) COOKIE = ''
    return res.data
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

async function test_saveFood() {
  // http://ruoyi.ruoyi-vue.192.168.3.173.nip.io:30737/prod-api/business/food_manage/list?pageNum=1&pageSize=10&sellStatus=%E4%B8%8A%E6%9E%B6&foodId=1161


  try {
    let cookie = await cookieMtRedis()
    let source = await readXls('plan/属性(2)(1).xlsx', 'Sheet1')
    // let source = [{ 商品名称: '椰奶红豆', 属性: '温度#冷#热' }]
    // let source = await readXls('plan/美团贡茶(1)(1)(3)(1)(1)(1)(2).xls', '门店商品')
    source = source.filter(v => v['菜名'] != '')
    // let source = ['火山石烤纯肉肠', '三拼手抓饼', '柠檬鸡爪4小个', '日式章鱼小丸子4个', '酸辣粉', '招牌芋圆', '芋圆椰奶烧仙草', '芋圆红豆双皮奶', '甜品招牌烧仙草', '芋圆椰汁西米露']
    let count = 1
    // {"group_id":18,"sub_attr":0}
    let dataSource = []
    // for (let f of source) {
    //   console.log(f['商品名称'], count)
    // let [data, _] = await knx.raw(`
    //     WITH a AS (
    //       SELECT * FROM foxx_food_manage  WHERE date = CURDATE() AND wmpoiid = 6119122 AND name IN('${f['商品名称']}')
    //     ),
    //     b AS (
    //       SELECT name, food_id FROM food_id_info
    //       INNER JOIN a ON food_platform_id = a.productId
    //     ),
    //     c AS (
    //       SELECT dict_value FROM sys_dict_data WHERE dict_type = 'food_cost_name' AND dict_value IN (SELECT food_id FROM b)
    //     ),
    //     c3 AS (
    //       SELECT * FROM food_id_info WHERE food_id IN (SELECT * FROM c)
    //     ),
    //     d AS (
    //       SELECT wmpoiid, name, tagName, productId FROM food_id_info i 
    //       LEFT JOIN foxx_food_manage f ON i.food_platform_id = f.productId
    //       WHERE i.food_id IN (SELECT dict_value FROM c) AND f.date = CURDATE() 
    //     ),
    //     e AS (
    //       SELECT d.*, s.reptile_type FROM d JOIN foxx_shop_reptile s USING(wmpoiid) WHERE s.reptile_type LIKE '%贡茶%'
    //     )		
    //     SELECT * FROM e
    // `)
    // let [data, _] = await knx.raw(`
    //   WITH c AS (
    //     SELECT dict_value FROM sys_dict_data WHERE dict_type = 'food_cost_name' AND dict_label IN ('${f['商品名称']}')
    //   ),
    //   c3 AS (
    //     SELECT * FROM food_id_info WHERE food_id IN (SELECT * FROM c)
    //   ),
    //   d AS (
    //     SELECT wmpoiid, name, tagName, productId FROM food_id_info i 
    //     LEFT JOIN foxx_food_manage f ON i.food_platform_id = f.productId
    //     WHERE i.food_id IN (SELECT dict_value FROM c) AND f.date = CURDATE() 
    //   ),
    //   e AS (
    //     SELECT d.*, s.reptile_type FROM d LEFT JOIN foxx_shop_reptile s USING(wmpoiid) WHERE s.reptile_type LIKE '%甜品%'
    //   )		  
    //   SELECT * FROM d
    // `)
    // let [data, _] = await knx.raw(`
    //   select * from foxx_food_manage where date = curdate() and name = '${f['商品名称']}' and wmpoiid in (9725155,9485479,10083564,9720238,9014461,10515109,11663727,10093423,9920776,10464925,9842782,10307635,9732198,9927233,10045394,9861088,9411146,10285968,9802089,9901167,10328667,10554281,10345552,9344971,9470147,10061444,10497086,10372220,11676413,9391341,9018543,9411129,10369391,11678300,10148759,8890748,9576423,10038920,11663498,9776028,10700120,9123504,10096753,11677836,9596488,9324887,9997882,9592515,10456106,9620939,11320119,9636784,11663360,8981920,9999141,10056855,9703463,9355348,10106799,9999888,10014983,10480104,9812382,11663221,10076509,8751302,10096784,12080368,11289597,10427603,9936831,11649027,10854598,10417267,9206216,11913814,12038505,11258970,10451351,10722222,7735904,11100585,10757738,9236042,8911549,9250896,9100878,11116331,9249572,9258295,11223023,7673028,12271123,6950373,9153911,8670629,7632277,7779873,11457605,8981890,7968147,11512917,7351446,7740255,11528661,8051354,8221674,8981943,6434760) 
    // `)

    //   data = data.map((v, i) => [cookie, v.wmpoiid, v.name, v.tagName, decodeSpuAttrs(f['属性']), null, i])
    //   dataSource.push(data)
    //   // let data = readJson('log/log.json')
    //   // data = data.map(v => v.meta)


    //   count += 1
    // }

    source = source.map((v, i) => [cookie, v.ID, v.菜名, v.分类名, decodeSpuAttrs(v.属性), null, i])
      .sort((a, b) => a[1] - b[1])

    await loop(updateDesc, source, false, { test: delFoods })
    // let data = readJson('log/log.json')
    // // // const pvs = { "1200004369": [{ "wm_product_property_template_id": 5167, "wm_product_lib_tag_id": 1200004369, "wm_product_lib_tag_name": "茶底", "parent_tag_id": 0, "is_required": 1, "input_type": 1, "level": 2, "is_leaf": 1, "sequence": 1, "char_index": "C", "prompt_document": "", "property_type": 1, "customized": 0, "multiSelect": 0, "enumLimit": -1, "maxLength": -1, "inputTypeLimit": "", "value_id": 1300019262, "value": "其他茶型" }] }
    // data = data.map(v => v.meta).sort((a, b) => a[1] - b[1])
    // await loop(updateDesc, data, false, { test: delFoods })
    // // let data = await readXls('plan/奶盖【茶底】缺失.xls', '美团')
    // data = data.map(v => v.meta)
    // await loop(updatePvs, data, false, { test: delFoods })
  } catch (err) {
    console.error(err)
  }
}

async function test_updateDesc() {
  try {
    let cookie = await cookieMtRedis()

    let data = await readXls('plan/违规词商品(1)(1).xlsx', 'Sheet')
    data = data.filter(v => v.平台 == '美团')
    // let data = await readJson('elm/log/log.json')
    // data = data.filter(v => v.平台 == '饿了么')
    let limit = pLimit(1)
    let limit2 = pLimit(50)

    let dat = data.map(v => [cookie, v.id, v.food_name, v.tag_name, v.商品描述]).sort((a, b) => a.id - b.id)
    // let dat = data.map(v =>)
    // await loop(renameFoodPic, dat, false)
    let uniqShops = Array.from(new Set(dat.map(v => v[1])))
    let shops = uniqShops.map(s => dat.filter(v => v[1] == s))
    console.log(shops.length, uniqShops, shops[0])
    for (let shop of shops) {
      console.log(shop[0][1])

      await sleep(5000)
      await Promise.all(
        shop.map(d => limit2(() => wrap(updateDesc, d)))
      )
      await wrap(delFoods, [cookie, shop[0][1]])

    }
    // await loop(updateDesc, dat, false, { test: delFoods })
  } catch (e) {
    console.error(e)
  }
}

async function updateFoodStock(cookie, id, name, stock = -1) {
  const fallbackApp = await new FallbackApp(id, cookie)

  try {
    const food = await fallbackApp.food.find(name)
    let skuIds = food.wmProductSkus.map(v => v.id)
    const foodUpdateStockRes = await fallbackApp.food.batchUpdateStock(skuIds, stock)
    return Promise.resolve({ foodUpdateStockRes, skuIds })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateFoodName(cookie, id, tagName, spuId, foodName, spuName) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    console.log(id, tagName, spuId, foodName, spuName)
    if (foodName.includes('冬至快乐')) {
      const foodUpdateNameRes = await fallbackApp.food.updateName(spuId, `${spuName}`)
      return Promise.resolve({ ...foodUpdateNameRes, foodName })
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateFoodName2(cookie, id, foodName, catName, newName, newPic) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    let food = await fallbackApp.food.find(foodName, catName)
    const r1 = await fallbackApp.food.updateName(food.id, newName)
    // const r2 = await fallbackApp.food.updateImg(food.id, newPic)
    return r1
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateFoodName3(cookie, id, foodName) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    let foods = await fallbackApp.food.searchFood(foodName)
    let foodUpdateNameRes = []
    for (let food of foods) {
      try {
        const isAct = food.wmProductSkus.length == 1 && food.wmProductSkus[0].actInfoList.find(f => f.actType == 17)
        const isAct001 = isAct && food.wmProductSkus[0].actInfoList.find(f => f.actType == 17).actShowPrice == "0.01"

        let newName = isAct001 ? '冰鲜柠檬水(首杯0.01)' : isAct ? '冰鲜柠檬水·折' : '冰鲜柠檬水'
        console.log(food.name, newName, food.wmProductSkus[0].actInfoList)
        let res = await fallbackApp.food.updateName(food.id, newName)
        foodUpdateNameRes.push({ ok: 1, res })
      } catch (e) {
        foodUpdateNameRes.push({ ok: 0, e })
      }
    }
    return Promise.resolve(foodUpdateNameRes)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateFoodName4(cookie, id, foodId, newName) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    return fallbackApp.food.updateName(foodId, newName)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_rename() {
  try {
    const cookie = await cookieMtRedis()

    // let data = await readXls('plan/7-26甜品产品名称修改.xlsx', '商品查询')
    // data = data.filter(v => v.平台 == '美团')
    let data = await readJson('log/log.json')

    let limit = pLimit(50)

    // let dat = data.map(v => [cookie, v.wmpoiid, v.productId, v.修改后的产品名])
    let dat = data.map(v => v.meta)
    // await loop(renameFoodPic, dat, false)
    await Promise.all(
      dat.map(d => limit(() => wrap(updateFoodName4, d)))
    )

    // await loop(updateFoodName4, dat, false)
  } catch (err) {
    console.error(err)
  }
}

async function test_rename_pic() {
  try {
    const cookie = await cookieMtRedis()

    let data = await readXls('plan/0.01招牌芋圆修改前备份(2).xlsx', 'Sheet1')
    data = data.map(v => [cookie, v.shop_id, v.food_name, v.tagName, v.new_name, v.pic])

    await loop(updateFoodName2, data, false)
  } catch (err) {
    console.error(err)
  }
}

async function test_actPrice() {
  let dataSource = readJson('log/log.json')
  dataSource = dataSource.map(v => Object.values(v.meta))

  await loop(updateAct, dataSource)
}

async function updateTagSeq(cookie, id, name) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const tags = await fallbackApp.food.listTags()
    const tagWillUpdate = tags.find(v => v.name.includes(name))
    if (!tagWillUpdate) return Promise.reject({ err: 'tag1 not find' })
    const tagUpdateSeqRes = await fallbackApp.food.updateFoodCatSeq(tagWillUpdate.id, 1)
    const tagUpdated = await fallbackApp.food.searchTag(name)
    return Promise.resolve({ ...tagUpdateSeqRes, tagUpdated: { seq: tagUpdated.sequence } })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateTagTime(cookie, id, name) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const tags = await fallbackApp.food.listTags()
    const tagWillUpdate = tags.find(v => v.name.includes(name))
    if (!tagWillUpdate) return Promise.reject({ err: 'tag1 not find' })
    const tagUpdateSeqRes = await fallbackApp.food.updateFoodCatSeq(tagWillUpdate.id, tags.length)
    const tagUpdated = await fallbackApp.food.searchTag(name)
    return Promise.resolve({ ...tagUpdateSeqRes, tagUpdated: { seq: tagUpdated.sequence } })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateTagTop(cookie, id, name) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const tags = await fallbackApp.food.listTags()
    const tagWillUpdate = tags.find(v => v.name.includes(name))
    if (!tagWillUpdate) return Promise.reject({ err: 'tag1 not find' })
    const tagUpdateSeqRes = await fallbackApp.food.updateFoodCatTop_(tagWillUpdate)
    const tagUpdated = await fallbackApp.food.searchTag(name)
    return Promise.resolve({ ...tagUpdateSeqRes, tagUpdated: { timeZone: tagUpdated.timeZoneForHuman } })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateTagUnTop(cookie, id, name) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const tags = await fallbackApp.food.listTags()
    const tagWillUpdate = tags.find(v => v.name.includes(name))
    if (!tagWillUpdate) return Promise.reject({ err: 'tag1 not find' })
    const tagUpdateSeqRes = await fallbackApp.food.updateFoodCatUnTop_(tagWillUpdate)
    const tagUpdated = await fallbackApp.food.searchTag(name)
    return Promise.resolve({ ...tagUpdateSeqRes, tagUpdated: { timeZone: tagUpdated.timeZone } })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_sortTag() {
  const fallbackApp = new FallbackApp()
  try {
    let dataSource = await fallbackApp.poi.list()
    dataSource = dataSource.map(v => [v.id, '5 2 0大行动'])

    await loop(updateTagSeq, dataSource)
  } catch (error) {
    console.error(error)
  }
}

async function test_name() {
  let fallbackApp = new FallbackApp()
  try {
    let pois = await fallbackApp.poi.list()
    let cnt = pois.length
    for (let poi of pois) {
      console.log(cnt)
      try {
        fallbackApp = new FallbackApp(poi.id)
        const tag = await fallbackApp.food.searchTag('甜糯汤圆')
        const foods = await fallbackApp.food.listFoods(tag.id)
        for (let food of foods) {
          try {
            const updateFoodNameRes = await updateFoodName(
              poi.id,
              '甜糯汤圆',
              food.id,
              food.name,
              food.name.replace('（冬至快乐）', '')
            )
            console.log(updateFoodNameRes)
          } catch (err) {
            console.error(err)
            log({ err, poi: poi.poiName })
          }
        }
      } catch (err) {
        console.error(err)
        log({ err, poi: poi.poiName })
      }
      cnt -= 1
    }
  } catch (error) {
    console.error(error)
  }
}

async function updateFoodCatName(cookie, id, tagName, newTagName) {
  try {
    const fallbackApp = new FallbackApp(id, cookie)
    const tag = await fallbackApp.food.searchTag(tagName)
    const tag1 = await fallbackApp.food.updateFoodCatName_(tag, newTagName)
    return Promise.resolve(tag1)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_catName() {
  try {
    const fallbackApp = new FallbackApp()
    let poiList = await fallbackApp.poi.list()
    for (let poi of poiList) {
      try {
        const res = await updateFoodCatName(poi.id, '冬至汤圆', '甜糯汤圆')
        console.log(res)
      } catch (err) {
        console.error(err)
        log({ shop: { id: poi.id, name: poi.name }, err })
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function moveFood(cookie, id, name) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    const tags = await fallbackApp.food.listTags()
    // const tag = tags.find(v => /.*店铺公告|门店公告|不要下单|别点了.*/.test(v.name))
    const tag = tags.find(v => /鲜奶系列/.test(v.name))
    if (!tag) {
      const oldTag = tags.find(v => v.name == '双皮奶类')
      if (!oldTag) return Promise.reject({ err: 'old tag null' })
      console.log(await fallbackApp.food.saveFoodCat('鲜奶系列', oldTag.sequence))
      await sleep(600)
      await moveFood(id, name)
    }
    const food = await fallbackApp.food.find(name)
    const res = await fallbackApp.food.batchUpdateTag(tag.id, [food.id])
    return res
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_move() {
  try {
    let data = await readJson('log/log.json')
    data = data.map(v => v.meta)
    await loop(moveFood, data, false)
  } catch (error) {
    console.error(error)
  }
}

export async function delFoods(cookie, id) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    console.log('del tests...', id)
    let tests = await fallbackApp.food.searchFood('测试')
    let tags = await fallbackApp.food.listTags()
    // console.log(tags)
    tests = tests.filter(v => /测试\d+/.test(v.name) && /店铺公告\d+/.test(v.tagName))
    tags = tags.filter(v => /店铺公告\d+/.test(v.name))


    console.log(tests.map(t => ({ name: t.name, tagName: t.tagName })))
    const res = tests.length > 0 ? await fallbackApp.food.batchDeleteFoods(tests.map(v => v.wmProductSkus.map(k => k.id).join(',')))
      : []
    await sleep(3000)
    const res2 = await Promise.all(tags.map(tag => fallbackApp.food.delTag(tag.id)))
    // let results = []
    // for (let tag of tags) {
    //   try {
    //     // console.log(tag.name)
    //     // if (id == 9470231 || id == 10085676) continue
    //     if (!/店铺公告\d+/.test(tag.name)) continue
    //     const tests = await fallbackApp.food.listFoods(tag.id)
    //     if (tests.length > 0) {
    //       const skuIds = tests.map(v => v.wmProductSkus.map(k => k.id).join(','))
    //       const res = await fallbackApp.food.batchDeleteFoods(skuIds)
    //       const res2 = await fallbackApp.food.delTag(tag.id)
    //       results.push({ tests: res, tag: res2 })
    //     } else if (tests.length == 0) {
    //       const res2 = await fallbackApp.food.delTag(tag.id)
    //       results.push({ tag: res2 })
    //     }
    //   } catch (err) {
    //     return Promise.reject({ err })
    //   }
    // }
    return Promise.resolve({ res, res2 })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function delFood(cookie, id, name) {
  try {
    const fallbackApp = new FallbackApp(id, cookie)
    let foods = await fallbackApp.food.searchFood(name)
    if (foods.length == 0) return
    const skuIds = foods.map(v => v.wmProductSkus.map(k => k.id).join(','))
    const res = await fallbackApp.food.batchDeleteFoods(skuIds)
    return res
  } catch (e) {
    return Promise.reject(e)
  }
}

async function delTag(cookie, id) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    let tag = await fallbackApp.food.searchTag('5 2 0大行动')
    return fallbackApp.food.delTag(tag.id)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function test_delTag() {
  try {
    let data = await new FallbackApp().poi.list()
    data = data.map(v => [v.id])
    await loop(delTag, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_delFoods() {
  try {
    let fallbackApp = new FallbackApp()
    let shops = await knx('foxx_shop_reptile').select().where({ status: 0 })

    // shops = shops.slice(shops.length - 260)

    await loop(delFoods, shops.map(s => [s.cookie, s.wmpoiid]), true)

    // await loop(delFood, shops.map(v => [v.id, '送你甜蜜魔盒（生活需要仪式感）']))
    // await loop(delFood, shops.map(v => [v.id, '520爱你💖甜甜蜜蜜💖(随单附赠小礼品）']))
    // await loop(delFood, shops.map(v => [v.id, '520爱你❥甜甜蜜蜜❥(随单附赠小礼品）']))
    // await loop(delFood, shops.map(v => [v.id, '520爱你❥甜甜蜜蜜❥']))
  } catch (error) {
    console.log(error)
  }
}

async function renameFood(cookie, id, spuId, oldName, newName) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    if (spuId) {
      const res = await fallbackApp.food.updateName(spuId, newName)
      return Promise.resolve({ res, newName })
    } else {
      const food = await fallbackApp.food.find(oldName)
      const res = await fallbackApp.food.updateName(food.id, newName)
      return Promise.resolve({ res, newName })
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_rename2() {
  try {
    let data = await readXls('plan/3-1批量修改.xls', '美团产品名修改')
    data = data.map(v => [v.shop_id, null, v.name, v.修改后的产品名])
    await loop(renameFood, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_pois() {
  try {
    const fallbackApp = new FallbackApp()
    let data = await fallbackApp.poi.list()
    data = data.map(v => ({
      id: v.id,
      name: v.poiName,
      city: v.city
    }))
    const res = await knx('mt_shops_').insert(data)
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

async function updateFoodSku(cookie, id, name, price, boxPrice) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    let skus = [
      {
        price,
        wmProductLadderBoxPrice: { ladder_num: 1, ladder_price: boxPrice, status: 1 }
      }
    ]
    const { ok } = await fallbackApp.food.setHighBoxPrice(0, true)
    if (ok) {
      const delActRes = await delAct(id, name)

      const minOrderCount = await fallbackApp.food.getMinOrderCount(name)
      // const minOrderCount = 2

      const updateSkusRes = await batchUpdateFoodSkus(id, name, skus)

      // const testsRes = await delFoods(id)

      if (delActRes.noAct) {
        const saveRes = await fallbackApp.food.save(name, minOrderCount)
        // const testsRes = await delFoods(id)
        return Promise.resolve({ delActRes, updateSkusRes, minOrderCount, saveRes })
      }

      const createActRes = await createAct(id, name, delActRes.actPrice, delActRes.orderLimit)
      // const sortActRes = await fallbackApp.act.sort(name, 30)
      const saveRes = await fallbackApp.food.save(name, minOrderCount)

      return Promise.resolve({ delActRes, updateSkusRes, createActRes, minOrderCount, saveRes })
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updatePlan(cookie, id, name, minOrder, price, boxPrice, actPrice, orderLimit) {
  const fallbackApp = new FallbackApp(id, cookie)
  let results = {}
  try {
    const minOrderCount = await fallbackApp.food.getMinOrderCount(name)
    const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      if (price) {
        let skus = [
          {
            price,
            wmProductLadderBoxPrice: boxPrice ? { ladder_num: 1, ladder_price: boxPrice, status: 1 } : null
          }
        ]

        const delActRes = await delAct(id, name)
        const updateSkusRes = await batchUpdateFoodSkus(id, name, skus)

        results.priceRes = {
          delActRes,
          updateSkusRes
        }

        if (minOrderCount != 1) {
          const saveRes = await fallbackApp.food.save2(name, null, minOrderCount)
          results.priceRes.saveRes = saveRes
        }

        if (!delActRes.noAct) {
          await sleep(2000)
          const createActRes = await createAct(id, name, delActRes.actPrice, delActRes.orderLimit)
          results.createActRes = createActRes
        }
      }

      if (boxPrice) {
        const boxPriceRes = await updateFoodBoxPrice(id, name, boxPrice)
        results.boxPriceRes = boxPriceRes
      }

      if (actPrice) {
        const delActRes = await delAct(id, name)
        let ol = -1
        if (delActRes.noAct && actPrice < 8) ol = 1
        if (!delActRes.noAct) ol = delActRes.orderLimit
        const actPriceRes = await createAct(id, name, actPrice, ol)
        results.actPriceRes = actPriceRes
      }

      if (orderLimit) {
        const delActRes = await delAct(id, name)
        const orderLimitRes = await createAct(id, name, delActRes.actPrice, orderLimit)
        results.orderLimitRes = orderLimitRes
      }

      if (minOrder) {
        const minOrderRes = await fallbackApp.food.save2(name, null, minOrder)
        results.minOrderCount = minOrderRes
      }

      return Promise.resolve(results)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function updatePlan2(cookie, id, catName, name, minOrder, price, boxPrice, actPrice, orderLimit, weight, unit, shouldDelAct) {
  const fallbackApp = new FallbackApp(id, cookie)

  let results = {}
  try {
    if (shouldDelAct) {
      const delActRes = await delAct(cookie, id, name)
      results['[删除折扣]'] = delActRes?.actDelRes?.msg
    }

    if (price != null) {
      // minOrder
      const minOrderCount = await fallbackApp.food.getMinOrderCount2(name, catName)

      let skus = [
        {
          price,
          weight_unit: unit,
          weight,
          minOrderCount: minOrder ?? minOrderCount,
          wmProductLadderBoxPrice: boxPrice != null ? { ladder_num: 1, ladder_price: boxPrice, status: 1 } : null
        }
      ]

      // delAct
      const delActRes = await delAct(cookie, id, name)

      // upSkus
      const updateSkusRes = await batchUpdateFoodSkus(cookie, id, name, catName, skus)

      results['[删除折扣]'] = delActRes?.actDelRes?.msg
      results['[修改规格]'] = updateSkusRes.msg

      // addAct
      if (!delActRes.noAct && actPrice == null && orderLimit == null) {
        const createActRes = await createAct(cookie, id, name, catName, delActRes.actPrice, delActRes.orderLimit, delActRes.sortIndex, delActRes.sortNumber)
        results['[创建活动]'] = `\n活动价: ${createActRes?.foodCreatedAct?.act_price}\n原价: ${createActRes?.foodCreatedAct?.origin_price}\n限购: ${createActRes?.foodCreatedAct?.orderLimit}`
      }
    }

    if (boxPrice != null && price == null) {
      const boxPriceRes = await updateFoodBoxPrice(cookie, id, name, catName, boxPrice)
      results['[修改餐盒价格]'] = boxPriceRes.msg
    }

    if (minOrder != null && price == null) {
      const minOrderRes = await fallbackApp.food.save2(name, catName, null, minOrder, null, null, weight, unit)
      results['[修改商品]'] = minOrderRes.msg
    }

    if ((weight != null || unit != null) && price == null && minOrder == null) {
      const weightRes = await fallbackApp.food.save2(name, catName, null, null, null, null, weight, unit)
      results['[修改商品]'] = weightRes.msg
    }

    /* act */
    if (actPrice != null && orderLimit != null) {
      const delActRes = await delAct(cookie, id, name)
      results['[删除折扣]'] = delActRes?.actDelRes?.msg
      const createActRes = await createAct(cookie, id, name, catName, actPrice, orderLimit, delActRes?.sortIndex, delActRes?.sortNumber)
      results['[创建活动]'] = `\n活动价: ${createActRes?.foodCreatedAct?.act_price}\n原价: ${createActRes?.foodCreatedAct?.origin_price}\n限购: ${createActRes?.foodCreatedAct?.orderLimit}`
    } else {
      if (actPrice) {
        const delActRes = await delAct(cookie, id, name)
        results['[删除折扣]'] = delActRes?.actDelRes?.msg
        const createActRes = await createAct(cookie, id, name, catName, actPrice, delActRes.orderLimit ?? -1, delActRes?.sortIndex, delActRes?.sortNumber)
        results['[创建活动]'] = `\n活动价: ${createActRes?.foodCreatedAct?.act_price}\n原价: ${createActRes?.foodCreatedAct?.origin_price}\n限购: ${createActRes?.foodCreatedAct?.orderLimit}`
      }

      if (orderLimit) {
        const delActRes = await delAct(cookie, id, name)
        results['[删除折扣]'] = delActRes?.actDelRes?.msg
        const createActRes = await createAct(cookie, id, name, catName, delActRes.actPrice, orderLimit, delActRes.sortIndex, delActRes.sortNumber)
        results['[创建活动]'] = `\n活动价: ${createActRes?.foodCreatedAct?.act_price}\n原价: ${createActRes?.foodCreatedAct?.origin_price}\n限购: ${createActRes?.foodCreatedAct?.orderLimit}`
      }
    }

    console.log('run ')
    return Promise.resolve(results)

  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

export async function updatePlan3(cookie, id, catName, name, minOrder, priceBoxPriceWieightAndUnits,
  actPrice, orderLimit, shouldDelAct, pic, newName, attrs, description, weight, unit) {
  const fallbackApp = new FallbackApp(id, cookie)

  let results = {}
  try {
    let food = await retryFind(cookie, id, catName, name)
    let foodAct = null

    if (pic) {
      const picRes = await updateImg(cookie, id, food.id, pic)
      results['[修改图片]'] = picRes
    }

    if (shouldDelAct) {
      const actIds = food.wmProductSkus.flatMap(sku => sku.actInfoList.map(act => act.actId)).filter(id => id != null)
      if (actIds.length > 0) {
        const delActRes = await fallbackApp.act.delete(actIds)
        results['[删除折扣]'] = delActRes?.msg
      }
    }

    if (priceBoxPriceWieightAndUnits.length > 0) {
      // minOrder
      const minOrderCount = await fallbackApp.food.getMinOrderCount2(name, catName)

      // delAct
      const actIds = food.wmProductSkus.flatMap(sku => sku.actInfoList.map(act => act.actId)).filter(id => id != null)
      if (actIds.length > 0) {
        foodAct = await fallbackApp.act.find2(actIds[0])
        const delActRes = await fallbackApp.act.delete(actIds)
        results['[删除折扣]'] = delActRes?.msg
      }

      if (food.wmProductSkus.length > 1) {
        const unifiedPackRes = await retrySaveFood(cookie, id, { name, catName }, {})
        results['[修改商品]'] = unifiedPackRes?.msg
      }

      let skus = priceBoxPriceWieightAndUnits.map(v => ({
        spec: v.spec,
        price: v.price,
        weight_unit: v.unit,
        weight: v.weight,
        minOrderCount: minOrder ?? minOrderCount,
        wmProductLadderBoxPrice: v.boxPrice != null ? { ladder_num: 1, ladder_price: v.boxPrice, status: 1 } : null
      }))

      // upSkus
      const updateSkusRes = await batchUpdateFoodSkus(cookie, id, name, catName, skus)
      results['[修改规格]'] = updateSkusRes.msg

      food = await retryFind(cookie, id, catName, name)

      // addAct
      if (foodAct && actPrice == null && orderLimit == null) {
        foodAct = { ...foodAct, actInfo: JSON.parse(foodAct.actInfo), charge: JSON.parse(foodAct.charge) }
        const saveActRes = await retryCreateAct(cookie, id, { act: foodAct },
          {
            id: 0, wmSkuId: food.wmProductSkus[0].id,
            "actInfo": {
              "discount": "NaN",
              "origin_price": food.wmProductSkus[0].price,
              "act_price": foodAct.actInfo.act_price
            },
            "WmActPriceVo": {
              "originPrice": food.wmProductSkus[0].price,
              "actPrice": foodAct.charge.actPrice,
              "mtCharge": "0", "agentCharge": 0,
              "poiCharge": food.wmProductSkus[0].price - foodAct.charge.actPrice
            }
          }
        )
        results['[创建折扣]'] = saveActRes

        const sortActRes = await fallbackApp.act.sort({ id: saveActRes[0]?.id },
          { skuSet: { sortNumber: foodAct.sortNumber }, opType: foodAct.sortIndex >= 1000000000 ? 8 : 7 })
        results['[排序折扣]'] = sortActRes
      }
    }

    if (minOrder != null && priceBoxPriceWieightAndUnits.length == 0) {
      const minOrderRes = await fallbackApp.food.batchUpdateMinOrderCount(food.id, minOrder)
      results['[修改起购]'] = minOrderRes.msg
    }

    /* act */
    if (actPrice != null || orderLimit != null) {
      // delAct
      const actIds = food.wmProductSkus.flatMap(sku => sku.actInfoList.map(act => act.actId)).filter(id => id != null)
      if (actIds.length > 0) {
        foodAct = await fallbackApp.act.find2(actIds[0])
        foodAct = { ...foodAct, actInfo: JSON.parse(foodAct.actInfo), charge: JSON.parse(foodAct.charge) }

        const delActRes = await fallbackApp.act.delete(actIds)
        results['[删除折扣]'] = delActRes?.msg

        const saveActRes = await retryCreateAct(cookie, id, { act: foodAct },
          {
            id: 0, wmSkuId: food.wmProductSkus[0].id,
            "actInfo": {
              "discount": "NaN",
              "origin_price": food.wmProductSkus[0].price,
              "act_price": actPrice ?? foodAct.actInfo.act_price
            },
            "WmActPriceVo": {
              "originPrice": food.wmProductSkus[0].price,
              "actPrice": actPrice ?? foodAct.charge.actPrice,
              "mtCharge": "0", "agentCharge": 0,
              "poiCharge": food.wmProductSkus[0].price - (actPrice ?? foodAct.charge.actPrice)
            },
            orderLimit: orderLimit ?? foodAct.orderLimit
          }
        )
        results['[创建折扣]'] = saveActRes

        const sortActRes = await fallbackApp.act.sort({ id: saveActRes[0]?.id },
          { skuSet: { sortNumber: foodAct.sortNumber }, opType: foodAct.sortIndex >= 1000000000 ? 8 : 7 })
        results['[排序折扣]'] = sortActRes
      } else {
        let act = {
          "id": 0,
          "wmPoiId": id,
          "wmSkuId": food.wmProductSkus[0].id,
          "wmActPolicyId": 1001,
          "actInfo": JSON.stringify({ isSettle: 1, discount: 2.85, origin_price: food.wmProductSkus[0].price, act_price: actPrice, onlinePay: 1 }),
          "wmUserType": 0,
          "poiUserType": 0,
          "orderPayType": 2,
          "orderLimit": orderLimit ?? -1,
          "charge": JSON.stringify({ actPrice: actPrice, agentCharge: 0.0, mtCharge: 0.0, orderPrice: 0.0, originPrice: food.wmProductSkus[0].price, poiCharge: food.wmProductSkus[0].price - actPrice }),
          "itemName": food.name,
          "dayLimit": -1,
          "wmActPoiId": 0,
          "settingType": 1,
          "todaySaleNum": -1,
          "sortIndex": 0,
          "actType": 17,
          "originId": 0,
          "spuId": food.id,
          "spec": "",
          "chargeType": 0,
        }
        const saveActRes = await retryCreateAct(cookie, id, { act }, {})
        results['[创建折扣]'] = saveActRes
      }
      // const delActRes = await delAct(cookie, id, food.id)
      // results['[删除折扣]'] = delActRes?.actDelRes?.msg
      // await sleep(4000)
      // const createActRes = await createAct(cookie, id, name, catName, actPrice, orderLimit, delActRes?.sortIndex, delActRes?.sortNumber)
      // results['[创建活动]'] = `\n活动价: ${createActRes?.foodCreatedAct?.act_price}\n原价: ${createActRes?.foodCreatedAct?.origin_price}\n限购: ${createActRes?.foodCreatedAct?.orderLimit}`
    }

    if (attrs || description || weight || unit) {
      const attrsRes = await fallbackApp.food.save2(name, catName, decodeSpuAttrs(attrs), null, description, null, weight, unit)
      results['[修改商品]'] = attrsRes.msg
    }

    if (newName) {
      const updNameRes = await fallbackApp.food.updateName(food.id, newName)
      results['[修改商品名称]'] = updNameRes.msg
    }

    console.log('run ')
    return Promise.resolve(results)

  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

export async function uploadImg(cookie, filename) {
  const fallbackApp = new FallbackApp(-1, cookie)
  try {
    const multipart = fs.readFileSync(`uploads/${filename}`).toString('base64')
    const res = await fallbackApp.food.uploadImg(multipart)
    return res
  } catch (err) {
    return Promise.reject(err)
  }
}

async function createTempFood(cookie, id, catName, retry = 0) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {


    await sleep(2000)
    let tempFood = await fallbackApp.food.find('temp', catName)

    return tempFood
  } catch (error) {
    if (retry < 3) return createTempFood(retry + 1)
    console.error(error)
  }
}

async function retryFind(cookie, id, catName, name, retry = 0) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    console.log('retry find ...', retry)
    await sleep(2500)
    let tempFood = await fallbackApp.food.find(name, catName)
    return tempFood
  } catch (error) {
    if (retry < 8) {
      return await retryFind(cookie, id, catName, name, retry + 1)
    }
    console.error(error)
    return Promise.reject(error)
  }
}

async function retryFind2(cookie, id, catName, name, retry = 0) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    console.log('retry find ...', retry)
    await sleep(2500)
    let tempFood = await fallbackApp.food.findInTag(name, catName)
    return tempFood
  } catch (error) {
    if (retry < 8) {
      return await retryFind(cookie, id, catName, name, retry + 1)
    }
    console.error(error)
    return Promise.reject(error)
  }
}

async function retryCreateAct(cookie, id, query, updates, retry = 0) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    console.log('retry create act ...', retry)
    await sleep(2500 + retry * 300)
    const saveAActRes = await fallbackApp.act.save2(query, updates)
    return saveAActRes
  } catch (error) {
    if (retry < 15) {
      return await retryCreateAct(cookie, id, query, updates, retry + 1)
    }
    console.error(error)
    return Promise.reject(error)
  }
}

async function retrySaveFood(cookie, id, query, updates, retry = 0) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    console.log('retry save food ...', retry)
    await sleep(2000)
    const saveFoodRes = await fallbackApp.food.save5(query, updates)
    return saveFoodRes
  } catch (error) {
    if (retry < 3) {
      return await retrySaveFood(cookie, id, query, updates, retry + 1)
    }
    console.error(error)
    return Promise.reject(error)
  }
}

function queryItem(array, query) {
  return array.filter(item =>
    Object.keys(query).reduce((p, v) => p && item[v] == query[v], true)
  )
}

function buildStockAndBoxPriceSkus(newSpuAttrs, wmProductSpu) {
  let g_new_spu_attrs = combineArray(Object.values(newSpuAttrs.filter(v => v.name == '份量' || v.price > 0)
    .reduce((p, v, _, a) => ({ ...p, [v.name]: a.filter(k => k.name == v.name) }), {})))

  return g_new_spu_attrs.map(v => {
    let wa = v.find(k => k.name == '份量')
    let unit = wa.weight == -2 ? wa.weightUnit : `${wa.weight}${wa.weightUnit}`
    let runit = /\d+人份/.test(unit) ? unit : '约' + unit
    let attrList = v.map(k => ({ ...k, value: k.name == '份量' && k.value == '' ? unit : k.value }))
      .map(k => keepBy(k, ['name', 'name_id', 'value', 'value_id'].concat(k.name == '份量' ? ['no'] : [])))
    let spec = (wa.value == '' ? runit : `${wa.value}（${runit}）`) +
      (v.filter(k => k.name != '份量').length > 0 ? ' ' : '') +
      v.filter(k => k.name != '份量').map(k => k.value).join('·')
    let osku = wmProductSpu.wmProductSkus.find(k => isSameArrayBy(k.attrList, v, ['name', 'value']))

    return {
      attrList,
      box_price: osku?.box_price ?? 0,
      price: wa.price,
      spec,
      unit,
      weight: wa.weight,
      wmProductLadderBoxPrice: {
        ladder_num: osku?.box_num ?? 1,
        ladder_price: osku?.box_price ?? 0,
        status: 1
      },
      wmProductStock: {
        id: "0",
        stock: osku?.stock ?? "10000",
        max_stock: "-1",
        auto_refresh: 1
      }
    }
  })
}

function buildWmProductPics(url) {
  return [{
    "pic_large_url": url,
    "pic_small_url": url,
    "sequence": 0, "specialEffectEnable": 0, "is_quality_low": false, "quality_score": 1, "picPropagandaList": [],
  }]
}

export async function substituteFood(cookie, id, aCatName, aName, bCatName, bName) {
  const fallbackApp = new FallbackApp(id, cookie)

  try {
    let aFood = await fallbackApp.food.find(aName, aCatName)
    let aFoodEdit = await fallbackApp.food.getEditView2(aFood.id)
    console.log('aFood')

    let bFood = await fallbackApp.food.find(bName, bCatName)

    let obFood = await fallbackApp.food.find(bName, bCatName)
    let obFoodEdit = await fallbackApp.food.getEditView2(bFood.id)
    let obFoodTemp = await fallbackApp.food.getTemplate(bFood.id, 1)
    let obActs = [],
      obActIds = obFood.wmProductSkus.map(sku => sku.actInfoList[0]?.actId).filter(id => id != null)
    if (obActIds.length > 0) {
      obActs = (await fallbackApp.act.list()).filter(v => obActIds.includes(v.id))
    }

    fs.appendFileSync('test2.json', JSON.stringify({ obFood, obFoodEdit, obActs }))

    console.log('bFood')

    let results = {}

    /*
    console.log('// create temp food')
    try {
      const res = await fallbackApp.food.createTestFoods([{
        "id": 0, "wm_poi_id": id, "isShippingTimeSyncPoi": 2, "shipping_time_x": "-",
        "name": 'temp',
        "description": "说明产品，请勿下单", "min_order_count": "10", "unit": "份",
        "tag_name": bCatName, "status": 0, "labelIds": "", "picture": "http%3A%2F%2Fp0.meituan.net%2Fwmproduct%2F2ba25f68ca66b4ab234607c3b510f8ff332609.png",
        "wmProductSkus": [{ "id": 0, "price": "88", "box_num": "1", "box_price": "0", "wm_food_spu_id": "", "spec": "", "valid": 1, "stock": -1 }]
      }])
      console.log(res)
      results['[create-t]'] = res?.msg
    } catch (err) {
      console.error('catch', err)
    }

    console.log('// del last temp')
    try {
      let lastTemp = await fallbackApp.food.find(bName + 't', bCatName)
      let delLastRes = await fallbackApp.food.batchDeleteFoods(lastTemp.wmProductSkus.map(sku => sku.id))
      console.log(delLastRes)
      // results['[del-t]'] = delLastRes
    } catch (err) {
      console.error('catch', err)
    }

    console.log('// get temp food')
    let tempFood = await retryFind(cookie, id, bCatName, 'temp')

    // MODIFY T
    console.log('// copy b to temp')
    const saveTempRes = await fallbackApp.food.save5(bName, bCatName, { id: tempFood.id, name: bName + 't' })
    console.log(saveTempRes)
    results['[copy-b->t]'] = saveTempRes?.msg

    console.log('// get modified temp')
    tempFood = await retryFind(cookie, id, bCatName, bName + 't')

    console.log('// create temp act')
    const bActId = bFood.wmProductSkus.map(sku => sku.actInfoList[0]?.actId).find(id => id != null)
    if (bActId) {
      const saveTempActRes = await retryCreateAct(cookie, id, bActId,
        { id: null, itemName: tempFood.name, spuId: tempFood.id, wmSkuId: tempFood.wmProductSkus[0].id }
      )
      console.log(saveTempActRes)
      results['[save-t-act]'] = saveTempActRes

      console.log('// get modified temp')
      tempFood = await retryFind(cookie, id, tempFood.tagName, tempFood.name)
    }
    */

    // MODIFY B
    console.log('// del b acts')
    const bActIds = bFood.wmProductSkus.flatMap(sku => sku.actInfoList.map(act => act.actId)).filter(id => id != null)
    if (bActIds.length > 0) {
      const delBActsRes = await fallbackApp.act.delete(bActIds)
      console.log(delBActsRes)
      results['[del-b-acts]'] = delBActsRes?.msg
    }

    // console.log('// save b sku')
    // const saveBSkusRes = await batchUpdateFoodSkus(cookie, id, bName, bCatName, [{
    //   spec: 'q',
    //   price: Math.max(...aFood.wmProductSkus.map(v => v.price)),
    //   weight_unit: '1人份',
    //   weight: -2,
    //   minOrderCount: 1,
    //   wmProductLadderBoxPrice: { ladder_num: 1, ladder_price: 0, status: 1 }
    // }])
    // results['[save-b-skus]'] = saveBSkusRes?.msg

    console.log('// save b1')

    const maxObFoodEditAddedPrice = obFoodEdit.wmProductSpu.newSpuAttrs.filter(v => v.name != '份量').length == 0 ? 0 :
      Math.max(...(combineArray(Object.values(obFoodEdit.wmProductSpu.newSpuAttrs.filter(v => v.name != '份量')
        .reduce((p, v, _, a) => ({ ...p, [v.name]: a.filter(k => k.name == v.name) }), {})))
        .map(arr => arr.reduce((p, v) => p + v.price, 0)))
      )

    let b1NewSpuAttrs = [
      ...obFoodEdit.wmProductSpu.newSpuAttrs,
      {
        "name": "份量",
        "name_id": 0,
        "price": 500 - maxObFoodEditAddedPrice,
        "value_id": 0,
        "value": "-",
        "no": obFoodEdit.wmProductSpu.newSpuAttrs.find(v => v.name == '份量').no,
        "mode": 2,
        "weight": -2,
        "weightUnit": "1人份",
        "sell_status": 0,
        "value_sequence": obFoodEdit.wmProductSpu.newSpuAttrs.filter(v => v.name == '份量').length + 1
      }
    ]
    const saveB1Res = await retrySaveFood(cookie, id, { food: obFood, foodEdit: obFoodEdit, foodTemp: obFoodTemp }, {
      unifiedPackagingFee: 2,
      newSpuAttrs: b1NewSpuAttrs,
      stockAndBoxPriceSkus: buildStockAndBoxPriceSkus(b1NewSpuAttrs, obFoodEdit.wmProductSpu)
    })
    console.log(saveB1Res)
    results['[save-b1]'] = saveB1Res?.msg

    console.log('// save b2')
    let b2NewSpuAttrs = [{
      "name": "份量",
      "name_id": 0,
      "price": 500 - maxObFoodEditAddedPrice,
      "value": "-",
      "value_id": 0,
      "no": obFoodEdit.wmProductSpu.newSpuAttrs.find(v => v.name == '份量').no,
      "mode": 2,
      "weight": -2,
      "weightUnit": "1人份",
      "sell_status": 0,
      "value_sequence": 1
    }]
    const saveB2Res = await retrySaveFood(cookie, id, { food: obFood, foodEdit: obFoodEdit, foodTemp: obFoodTemp }, {
      unifiedPackagingFee: 1,
      newSpuAttrs: b2NewSpuAttrs,
      stockAndBoxPriceSkus: [],
      wmProductLadderBoxPrice: { ladder_num: 1, ladder_price: 0, status: 1 }
    })
    console.log(saveB2Res)
    results['[save-b2]'] = saveB2Res?.msg

    console.log('// copy a to b')
    const saveBRes = await retrySaveFood(cookie, id, { name: aName, catName: aCatName },
      { id: bFood.id, name: '测试', labelList: aFoodEdit.wmProductSpu?.labelList?.filter(v => v.group_id != 1) ?? [] })
    console.log(saveBRes)
    results['[copy-a->b]'] = saveBRes?.msg

    console.log('// get modified b')
    bFood = await retryFind2(cookie, id, aCatName, '测试')

    console.log('// create b acts')
    let aActIds = aFood.wmProductSkus.map(sku => sku.actInfoList[0]?.actId).filter(id => id != null)
    if (aActIds.length > 0) {
      const saveBActsRes = await Promise.allSettled(aActIds.map(async aActId => {
        let act = await fallbackApp.act.find2(aActId)
        return await retryCreateAct(cookie, id, { act },
          {
            id: 0, itemName: bFood.name, spuId: bFood.id, wmSkuId: bFood.wmProductSkus.find(k => k.spec == act.spec)?.id
          }
        )
      }))
      console.log(saveBActsRes)
      results['[save-b-acts]'] = saveBActsRes
    }

    // MODIFY A
    console.log('// del a acts')
    aActIds = aFood.wmProductSkus.flatMap(sku => sku.actInfoList.map(act => act.actId)).filter(id => id != null)
    if (aActIds.length > 0) {
      const delAActsRes = await fallbackApp.act.delete(aActIds)
      console.log(delAActsRes)
      results['[del-a-acts]'] = delAActsRes?.msg
    }

    console.log('// save a1')
    const maxAFoodEditAddedPrice = aFoodEdit.wmProductSpu.newSpuAttrs.filter(v => v.name != '份量').length == 0 ? 0 :
      Math.max(...(combineArray(Object.values(aFoodEdit.wmProductSpu.newSpuAttrs.filter(v => v.name != '份量')
        .reduce((p, v, _, a) => ({ ...p, [v.name]: a.filter(k => k.name == v.name) }), {})))
        .map(arr => arr.reduce((p, v) => p + v.price, 0)))
      )

    let a1NewSpuAttrs = [
      ...aFoodEdit.wmProductSpu.newSpuAttrs,
      {
        "name": "份量",
        "name_id": 0,
        "price": 500 - maxAFoodEditAddedPrice,
        "value_id": 0,
        "value": "-",
        "no": aFoodEdit.wmProductSpu.newSpuAttrs.find(v => v.name == '份量').no,
        "mode": 2,
        "weight": -2,
        "weightUnit": "1人份",
        "sell_status": 0,
        "value_sequence": aFoodEdit.wmProductSpu.newSpuAttrs.filter(v => v.name == '份量').length + 1
      }
    ]
    const saveA1Res = await retrySaveFood(cookie, id, { name: aName, catName: aCatName }, {
      unifiedPackagingFee: 2,
      newSpuAttrs: a1NewSpuAttrs,
      stockAndBoxPriceSkus: buildStockAndBoxPriceSkus(a1NewSpuAttrs, aFoodEdit.wmProductSpu)
    })
    console.log(saveA1Res)
    results['[save-a1]'] = saveA1Res?.msg

    console.log('// save a2')
    let a2NewSpuAttrs = [{
      "name": "份量",
      "name_id": 0,
      "price": 500 - maxAFoodEditAddedPrice,
      "value": "-",
      "value_id": 0,
      "no": aFoodEdit.wmProductSpu.newSpuAttrs.find(v => v.name == '份量').no,
      "mode": 2,
      "weight": -2,
      "weightUnit": "1人份",
      "sell_status": 0,
      "value_sequence": 1
    }]
    const saveA2Res = await retrySaveFood(cookie, id, { name: aName, catName: aCatName }, {
      unifiedPackagingFee: 1,
      newSpuAttrs: a2NewSpuAttrs,
      stockAndBoxPriceSkus: [],
      wmProductLadderBoxPrice: { ladder_num: 1, ladder_price: 0, status: 1 },
    })
    console.log(saveA2Res)
    results['[save-a2]'] = saveA2Res?.msg

    console.log('// copy b to a')
    const saveARes = await retrySaveFood(cookie, id, { food: obFood, foodEdit: obFoodEdit, foodTemp: obFoodTemp },
      { id: aFood.id })
    console.log(saveARes)
    results['[copy-b->a]'] = saveARes?.msg

    console.log('// get modified a')
    aFood = await retryFind2(cookie, id, obFood.tagName, obFood.name)

    console.log('// create a acts')
    if (obActs.length > 0) {
      try {
        const saveAActsRes = await Promise.allSettled(obActs.map(async obAct =>
          retryCreateAct(cookie, id, { act: obAct },
            { id: 0, itemName: aFood.name, spuId: aFood.id, wmSkuId: aFood.wmProductSkus.find(k => k.spec == obAct.spec)?.id }
          )
        ))
        console.log(saveAActsRes)
        results['[save-a-acts]'] = saveAActsRes
      } catch (err) {
        console.error('catch', err)
      }
    }

    /*
    console.log('// del temp')
    try {
      let delTempRes = await fallbackApp.food.batchDeleteFoods(tempFood.wmProductSkus.map(sku => sku.id))
      console.log(delTempRes)
      results['[del-t]'] = delTempRes?.msg
    } catch (err) {
      console.error('catch', err)
    }
    */

    console.log('// save b name')
    const saveBName = await fallbackApp.food.updateName(bFood.id, aName)
    console.log(saveBName)
    results['[save-b-name]'] = saveBName?.msg

    return results
  } catch (err) {
    return Promise.reject(err)
  }
}


/* 
ctx: {
  cookie,
  pois: []
},
query: {
  poi_id/门店ID,
  poi_name/门店名称,
  tag_id/分类ID,
  tag_name/分类名称,
  spu_id/商品ID,
  spu_name/商品名称,
},
updates: {
  attrs: [{name/属性名, value/属性值, op/属性操作, new_value/修改后属性值, price/加价, sell/售卖, unit/单位}], 
  skus: [{id/规格ID, spec/规格名称, op/规格操作, stock/库存, box_num/餐盒数量, box_price/餐盒价格, unit/单位, act: {price/折扣价格, limit/折扣限购}}],
  // -: newSpuAttrs {price, unit} -attr <- wmProductSkus(spec).attrList[0]
        stockAndBox {box_price, box_num, stock} -box,stock wmProductSkus(spec).box,stock
     +: newSpuAttrs wmProductSkus(spec).attrList[0]->newSpuAttrs 
           
  min_order_count/最小购买量,
  sell_status/售卖状态 ?,
  pic/图片,
  attr/属性 ?,
  desc/描述,
  single_buy/单点不送,
  label_sign/店内招牌 ?,
  tag: {} ?,
}
*/
export async function updatePlan4(cookie, ctx, query, updates) {
  function opSku(op, item, skus) {
    let nskus = [...skus]
    let i = nskus.findIndex(v => v.id == item.id || v.spec == item.spec), k = nskus[i]
    if (op == '-' && i > -1) nskus.splice(i, 1)
    if (op == '+' && i == -1) nskus.push(item)
    if (op == '+' && i > -1) nskus[i] = { ...k, ...item }
    return nskus
  }

  function sortNewSpuAttrs(attrs) {
    return attrs.sort((a, b) => (a.no * 100 + a.value_sequence - b.no * 100 + b.value_sequence))
  }

  function groupNewSpuAttrs(attrs) {
    return attrs.reduce((p, v, _, a) => ({ ...p, [v.name]: a.filter(k => k.name == v.name) }), {})
  }

  function isAddedPriceGroup(values) {
    if (values.find(v => v.name == '份量' || v.price > 0)) return true
    return false
  }

  function flattenNewSpuAttrsGroup(group) {
    return Object.keys(group).filter(g => group[g].length > 0)
      .flatMap((g, i) => group[g].map((v, j, a) => ({
        ...v,
        mode: isAddedPriceGroup(a) ? 2 : 1,
        no: i,
        value_sequence: j + 1
      })))
  }

  function extractWeightUnit(unit) {
    const m1 = unit?.match(/\d+人份/), m2 = unit?.match(/(\d+)(.*)/)
    if (m1) return { weight: -2, weightUnit: m1[0] }
    if (m2) return { weight: m2[1], weightUnit: m2[2] }
    return { weight: null, weightUnit: null }
  }

  function mergeAttrToNewSpuAttr(oattr, attr) {
    const { weight, weightUnit } = extractWeightUnit(attr.unit)
    let defaultAttr = { name_id: 0, value: attr.value, value_id: 0, sell_status: 0, price: 0, weightUnit: null },
      defaultWeightAttr = { ...defaultAttr, weight: -1 },
      defaultOtherAttr = { ...defaultAttr, weight: 0 },
      partAttr = { name: attr.name, value: attr.new_value, price: attr.price, sell_status: attr.sell, weight, weightUnit }

    if (attr.name == '份量') return mergeObjs(defaultWeightAttr, oattr, partAttr)
    return mergeObjs(defaultOtherAttr, oattr, partAttr)
  }

  function mapSkuToAttr(sku, oskus, oattrs) {
    let fsku = oskus.find(v => v.spec == sku.spec)
    if (!fsku) return { name: '份量', value: sku.spec, op: sku.op, price: sku.price, unit: sku.unit }
    let fattrs = oattrs.filter(v => includesBy(fsku.attrList, v, ['name', 'value']))
    let weight_attr = fattrs.find(v => v.name == '份量')
    let other_attrs = diffArrayBy(fattrs, [weight_attr], ['name', 'value'])
    let weight_price = sku.price == null ? null :
      calcPrice(() => sku.price - other_attrs.map(v => v.price).reduce((p, v) => p + v, 0))
    return {
      name: weight_attr.name, value: weight_attr.value, op: sku.op, price: weight_price, unit: sku.unit
    }
  }

  function opAttrs(attrs, newSpuAttrs) {
    let group = groupNewSpuAttrs(sortNewSpuAttrs(newSpuAttrs))
    for (let attr of attrs) {
      let g = group[attr.name]
      let i = g?.findIndex(v => v.value == attr.value) ?? -1
      if (attr.op == '+') {
        if (g == null) group[attr.name] = []
        if (i == -1) group[attr.name].push(mergeAttrToNewSpuAttr(null, attr))
        else group[attr.name][i] = mergeAttrToNewSpuAttr(g[i], attr)
      } else if (attr.op == '-') {
        if (i > -1) group[attr.name].splice(i, 1)
      }
    }
    return flattenNewSpuAttrsGroup(group)
  }

  try {
    const { pois } = ctx
    const { poi_id, poi_name, tag_id, tag_name, spu_id, spu_name } = query
    const { skus, min_order_count, sell_status, pic, attr, desc, single_buy, label_sign } = updates
    let results = {}, spuUpdates = {}

    const fallbackApp = new FallbackApp(id, cookie)

    // get poi food edit template acts 
    let poi = pois.find(v => v.id == poi_id || v.poiName == poi_name)
    if (poi == null) return Promise.reject({ message: `poi:${poi_id} not found` })
    if (poi.category != 'FOOD_CATE') return Promise.reject({ message: `poi-cate:${poi.category} not supported` })

    let food = await fallbackApp.food.findFood({ spuId: spu_id, spuName: spu_name, tagId: tag_id, tagName: tag_name })
    let foodEdit = await fallbackApp.getEditView2(food.id)
    let foodTemp = await fallbackApp.food.getTemplate(food.id, 1)

    let foodActs = []
    let foodActIds = food.wmProductSkus.map(sku => sku.actInfoList[0]?.actId).filter(id => id != null)
    if (foodActIds.length > 0) {
      foodActs = (await fallbackApp.act.list()).filter(v => foodActIds.includes(v.id))
    }

    // trans edit
    foodEdit.wmProductSpu.labelList = foodEdit.wmProductSpu.labelList ?? []
    foodEdit.wmProductSpu.wmProductSkus = foodEdit.wmProductSpu.wmProductSkus.map((v, _, a) => ({ ...v, spec: a.length == 1 ? '' : v.spec }))

    // save food
    if (min_order_count != null) {
      if (!/\d+/.test(min_order_count)) return Promise.reject({ message: `min_order_count: ${min_order_count} invalid` })
      spuUpdates.min_order_count = min_order_count
    }
    if (pic != null) {
      if (!pic.startsWith('http')) return Promise.reject({ message: `pic: ${pic} invalid` })
      spuUpdates.wmProductPics = buildWmProductPics(pic)
    }
    if (desc != null) spuUpdates.description = desc
    if (single_buy != null) {
      spuUpdates.singleOrderNoDelivery = single_buy
      if (single_buy == 0) spuUpdates.labelList = foodEdit.wmProductSpu.labelList.filter(v => v.group_id != 18)
      else if (single_buy == 1) spuUpdates.labelList = foodEdit.wmProductSpu.labelList.find(v => v.group_id == 18) ?
        foodEdit.wmProductSpu.labelList : [...foodEdit.wmProductSpu.labelList, { group_id: 18, sub_attr: 0 }]
      else return Promise.reject({ message: `single_buy: ${single_buy} invalid` })
    }
    if (label_sign != null) {
      if (label_sign == 0) spuUpdates.labelList = foodEdit.wmProductSpu.labelList.filter(v => v.group_id != 1)
      else if (label_sign == 1) spuUpdates.labelList = foodEdit.wmProductSpu.labelList.find(v => v.group_id == 1) ?
        foodEdit.wmProductSpu.labelList : [...foodEdit.wmProductSpu.labelList, { group_id: 1, sub_attr: 0 }]
      else return Promise.reject({ message: `label_sign: ${label_sign} invalid` })
    }

    // sku -> newSpuAttrs, stockAndBox
    if (skus.length > 0) {
      // op sku
      let nskus = [...wmProductSpu.wmProductSkus]
      for (let sku of skus) {
        const { id, spec, op, price, stock, box_num, box_price, unit } = sku
        nskus = opSku(op, sku, nskus)
      }
    }

    const saveFRes = await fallbackApp.food.save5({ food, foodEdit, foodTemp }, {

    })


  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateNotDeliverAlone(cookie, id, name) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    // const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (true) {
      return fallbackApp.food.save2(name, null, null, null, true)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function test_plan() {
  try {
    let data = await readXls('plan/武广美团贡茶.xlsx', 'hh美团产品名带折扣')
    data = data
      .filter(v => v.调整后餐盒费 != '' || v.调整后折扣价格 != '')
      .map((v, i) => [
        9535472,
        v.tagName,
        v.food_name,
        null,
        null,
        null,
        v.修改后特价 == '' ? null : v.修改后特价,
        null,
        i
      ])
    await loop(updatePlan2, data, false, { test: delFoods })
  } catch (error) {
    console.error(error)
  }
}

async function test_updateActTime() {
  try {
    // let data = await knx('test_mt_acts_').select()
    // data = data.map(v => [v.wmPoiId, v.act_str]).slice(14000, 16000)
    let data = await readJson('log/log.json').map(v => v.meta)
    await loop(updateActTime, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_updateAct() {
  try {
    let data = await readXls('plan/美团折扣价修改.xls', '2美团商品查询')
    data = data.filter(v => v.修改后折扣价 != '').map(v => [v.编号, v.商品, v.修改后折扣价])
    await loop(updateAct, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_createAct() {
  try {
    // let data = `9663962
    // 8135116
    // 7180353
    // 10304111
    // 2924399
    // 9976196
    // 9306217
    // 9718661
    // 7735455
    // 10039526
    // 8600359
    // 8591999
    // 7449372
    // 8939455
    // 6914754
    // 9412662
    // 9718295
    // 9365870
    // 8195644
    // 9771558
    // 7918815
    // 8195835
    // 6119122
    // 4799060
    // 10065090
    // 7552065
    // 9155621
    // 7973175
    // 10711763
    // 7439647
    // 9271561
    // 10085036
    // 8953861
    // 10159750
    // 10049050
    // 10096975
    // 9760354
    // 8025493
    // 9134834
    // 9820232
    // 10028591
    // 9622013
    // 7494614
    // 9062221
    // 8996740
    // 9808200
    // 10376620
    // 9927170
    // 9481181
    // 9959091
    // 9947800
    // 9899410`
    //   .split('\n')
    //   .map(v => v.trim())
    let data = await readXls('plan/美团汤圆(3)(1)(1)(1).xls', 'Sheet1')
    data = data.filter(v => v.修改后折扣价 != '').map(v => [v.编号, v.商品, v.修改后折扣价])

    // data = data.map(v => [v, '五福临门年夜饭套餐', 99.9])
    await loop(createAct, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function delNewCustAct(cookie, id) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const act = await fallbackApp.act.newCustomer.find()
    return fallbackApp.act.newCustomer.delete(act.id)
  } catch (e) {
    return Promise.reject(e)
  }
}
// 231
async function test_delNewCustomer() {
  try {
    let data = await readXls('plan/新客立减.xls', 'Sheet1')
    data = data.map(v => [v.wmpoiid])
    await loop(delNewCustAct, data, true)
  } catch (error) {
    console.error(error)
  }
}

async function test_delAct() {
  try {
    let data = await readXls('plan/美团折扣商品涨原价表格模板(1).xlsx', 'Sheet1')
    data = data.map(v => [, v['店铺id'], v['商品名称']])
    await loop(delAct, data, true)
  } catch (error) {
    console.error(error)
  }
}

async function delDieliverAct(cookie, id) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const act = await fallbackApp.act.dieliver.find()
    return fallbackApp.act.dieliver.delete(act.id)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function createDieliverAct(cookie, id, fee) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const res = await delDieliverAct(id)
    const policy = [{ discount: fee, shipping_charge: '0', mt_charge: '0', poi_charge: fee, agent_charge: '0' }]
    const res2 = await fallbackApp.act.dieliver.save(policy)
    return Promise.resolve({ res2 })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function test_reduction2() {
  try {
    let data = await readXls('plan/择优门店方案（广州、上海、北京、贵阳、厦门）.xlsx', 'Sheet1')
    data = data.map(v => ({
      ...v,
      reduc: v.需要修改的.split(',').map(k => ({
        discounts: [
          {
            code: 1,
            discount: k.split('-')[1],
            poi_charge: k.split('-')[1],
            agent_charge: 0,
            type: 'default',
            mt_charge: 0
          }
        ],
        price: k.split('-')[0]
      }))
    }))
    data = data.map(v => [v['门店ID'], null, null, v['reduc']])
    await loop(saveReduction, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_delivery() {
  try {
    let data = ``
      .split('\n')
      .map(v => v.trim())
    data = data.map(v => [v, 6.1])
    await loop(createDieliverAct, data, false)
  } catch (e) {
    console.error(e)
  }
}

async function test_updateTagName() {
  try {
    let data = await readXls('plan/3-1批量修改.xls', '美团分类名修改')
    data = data.map(v => [v.shop_id, v.category_name, v.修改后的分类名])
    await loop(updateFoodCatName, data, false)
  } catch (err) {
    console.error(err)
  }
}

async function test_updateTagTop() {
  try {
    let data = await readXls('plan/美团汤圆(3)(1)(1)(1).xls', 'Sheet1')
    data = Array.from(new Set(data.map(v => v.编号)))
    data = data.map(v => [v, '元宵汤圆'])
    await loop(updateTagTop, data, false)
  } catch (err) {
    console.error(err)
  }
}

async function test_updateTagUnTop() {
  try {
    let data = await readXls('plan/美团汤圆(3)(1)(1)(1).xls', 'Sheet1')
    data = Array.from(new Set(data.map(v => v.编号)))
    data = data.map(v => [v, '元宵汤圆'])
    await loop(updateTagUnTop, data, false)
  } catch (err) {
    console.error(err)
  }
}

async function updateFoodMater(cookie, id, name) {
  try {
    const fallbackApp = new FallbackApp(id, cookie)
    return fallbackApp.food.save(name, null, null, '椰果')
  } catch (e) {
    return Promise.reject(e)
  }
}

async function updateFoodWeight(cookie, id, name, weight, unit) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice(0, true)
    if (ok) {
      const res = await fallbackApp.food.save(name, null, weight, unit)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_updateWeight() {
  try {
    let [data, _] = await knx.raw(
      `select * from foxx_food_manage where date=curdate() and name LIKE '%杨枝甘露%' AND minOrderCount <> 2 AND weightUnit <> '2人份'`
    )
    data = data.slice(8).map((v, i) => [v.wmpoiid, v.name, '500', '毫升', i])
    await loop(updateFoodWeight, data, true, { test: delFoods })
  } catch (error) {
    console.error(error)
  }
}

async function updateFoodMinOrder(cookie, id, name, catName, minOrder) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const { ok } = { ok: true } // await fallbackApp.food.setHighBoxPrice(0, true)

    if (ok) {
      // const res = await fallbackApp.food.save(name, minOrder)
      const res = await fallbackApp.food.save2(name, catName, null, minOrder)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_updateMinOrder() {
  try {
    let data = await readXls('plan/05-23饿了么低折扣商品起购错误查询(1)(1).xlsx', '饿了么低折扣商品起购错误查询')
    data = data
      .filter(v => v.平台 == '美团')
      .map(v => [v.店铺id, v.商品, v.分类, 1])
    await loop(updateFoodMinOrder, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_autotask() {
  try {
    let tasks = {
      薯饼虾饼鸡柳无起购: async function () {
        try {
          console.log('薯饼虾饼鸡柳无起购')
          let task = await knx('test_task_')
            .select()
            .where({ title: '薯饼虾饼鸡柳无起购', platform: '美团' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map((v, i) => [v.门店id, v.品名, 2, null, null, 0.99, 1, i])
          await loop(updatePlan, data, false, { test: delFoods })
        } catch (e) {
          console.error(e)
        }
      },
      两份起购餐盒费: async function () {
        try {
          console.log('两份起购餐盒费')
          let task = await knx('test_task_')
            .select()
            .where({ title: '两份起购餐盒费', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.门店id, v.品名, null, 1.5, null, null])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      },
      两份起购无餐盒费: async function () {
        try {
          console.log('两份起购无餐盒费')
          let task = await knx('test_task_')
            .select()
            .where({ title: '两份起购无餐盒费', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.门店id, v.品名, null, 0.5, null, null])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      },
      常规产品无餐盒费: async function () {
        try {
          console.log('常规产品无餐盒费')
          let task = await knx('test_task_')
            .select()
            .where({ title: '常规产品无餐盒费', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.门店id, v.品名, null, 1, null, null])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      },
      非: async function () {
        try {
          console.log('非')
          let task = await knx('test_task_')
            .select()
            .where({ title: '≠6.9+0.5', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.shop_id, v.name, null, 0.5, 6.9, null])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      },
      原价餐盒凑起送: async function () {
        try {
          console.log('原价餐盒凑起送')
          let task = await knx('test_task_')
            .select()
            .where({ title: '原价餐盒凑起送', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.门店id, v.品名, null, 1, 13.8, null])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      },
      甜品粉面套餐: async function () {
        try {
          console.log('甜品粉面套餐')
          let task = await knx('test_task_')
            .select()
            .where({ title: '甜品粉面套餐', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.门店id, v.品名, null, 2, 27.8, 15.8])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      },
      贡茶粉面套餐: async function () {
        try {
          console.log('贡茶粉面套餐')
          let task = await knx('test_task_')
            .select()
            .where({ title: '贡茶粉面套餐', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.门店id, v.品名, null, 2, 29.6, 15.8])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      },
      除原价扣点加料价格: async function () {
        try {
          console.log('除原价扣点加料价格')
          let task = await knx('test_task_')
            .select()
            .where({ title: '除原价扣点加料价格', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.门店id, v.品名, null, 0, 6, null])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      },
      两份起购起购数: async function () {
        try {
          console.log('两份起购起购数')
          let task = await knx('test_task_')
            .select()
            .where({ title: '两份起购起购数', platform: '饿了么' })
          if (!task) return
          let [data, _] = await knx.raw(task[0].sql)
          data = data.map(v => [v.门店id, v.品名, 2, null, null, null])
          await loop(updatePlan, data, false)
        } catch (e) {
          console.error(e)
        }
      }
    }
    // await tasks['薯饼虾饼鸡柳无起购']()
    const fallbackApp = new FallbackApp(9999888)

    console.log(await fallbackApp.food.save('招牌芋圆【店长推荐】', 1, null, null))
  } catch (error) {
    console.error(error)
  }
}

async function updateStock2(cookie, id) {
  const fallbackApp = await new FallbackApp(id, cookie)

  try {
    const foods = await fallbackApp.food.list2_({
      opType: 1,
      queryCount: 1,
      pageNum: 1,
      pageSize: 500,
      wmPoiId: id,
      needAllCount: true,
      needTagList: true
    })
    let skuIds = flatten(foods.productList.map(v => v.wmProductSkus.map(sku => sku.id)))

    const foodUpdateStockRes = await fallbackApp.food.batchUpdateStock(skuIds, -1)
    return Promise.resolve({ foodUpdateStockRes, skuIds })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_stock() {
  try {
    let data = await readJson('log/log.json')
    data = data.map(v => v.meta)

    await loop(updateStock2, data, false)
  } catch (e) {
    console.log(e)
  }
}

async function test_boxPrice() {
  try {
    let data = await readXls('plan/折扣价0.01的商品餐盒费.xls', 'Sheet1')
    data = data.map((v, i) => [v.门店id, v.品名, 1.5, i])

    await loop(updateFoodBoxPrice, data, false, { test: delFoods })
  } catch (e) {
    console.log(e)
  }
}

async function listLowQuals(cookie, id) {
  const fallbackApp = new FallbackApp(id, cookie)
  try {
    const { wmLowQualitySpus } = await fallbackApp.food.listLqs()
    let data = wmLowQualitySpus.map(spu =>
      spu.wmLowQualityEntityList.map(entity => ({
        wmPoiId: id,
        spuId: spu.spuId,
        name: spu.name,
        picture: spu.picture,
        priceRange: spu.priceRange,
        monthSaled: spu.monthSaled,
        code: entity.code,
        desc: entity.desc
      }))
    )
    data = flatten(data)
    if (data.length == 0) return Promise.resolve('no lqs')
    return knx('test_mt_food_lq_').insert(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_lq() {
  try {
    const app = new FallbackApp()
    let data = await app.poi.list()
    data = data.map(v => [v.id])
    await loop(listLowQuals, data, false)
  } catch (e) {
    console.log(e)
  }
}

async function getTemplate(cookie, id, spuId) {
  try {
    const fallbackApp = new FallbackApp(id, cookie)
    const temp = await fallbackApp.food.getTemplate(spuId, 1)
    return Promise.resolve(temp)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function getAttrs(cookie, id, spuId) {
  try {
    const fallbackApp = new FallbackApp(id, cookie)
    const editView = await fallbackApp.food.getEditView2(spuId)
    return Promise.resolve(editView.wmProductSpu.newSpuAttrs)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function updateTemplateAndAttrs(cookie, id, name, catName) {

  try {
    const fallbackApp = new FallbackApp(id, cookie)
    const food = await fallbackApp.food.find(name, catName)
    const spuId = food.id
    const temp1 = await getTemplate(cookie, id, spuId)
    const temp2 = await getTemplate(cookie, 6434760, 1333130595)
    const attrs2 = (await getAttrs(cookie, 6434760, 1333130595)).filter(v => v.name != '份量')
    const temp = combineTemp(temp1, temp2)
    console.log(attrs2)
    // console.log(temp)
    const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      return fallbackApp.food.save4(spuId, attrs2, temp2.categoryId, temp, '')
    } else {
      return Promise.reject('h e')
    }
  } catch (e) {
    return Promise.reject(e)
  }

  function combineTemp(temp1, temp2) {
    return { ...temp2.properties_values, '1200001152': temp1.properties_values['1200001152'] }
  }
}

async function test_getTemp() {
  try {

    // let [data, _] = await knx.raw(`SELECT *, r.cookie FROM foxx_food_manage f 
    //   LEFT JOIN foxx_shop_reptile r USING(wmpoiid)
    //   WHERE date = CURDATE() AND name LIKE '莲子椰汁西米露%'`)
    const cookie = await cookieMtRedis()
    // let data = await readXls('plan/0.01招牌芋圆修改前备份(2).xlsx', 'Sheet1')
    let data = await readJson('log/log.json')
    // data = data.map(v => [cookie, v.shop_id, v.new_name, v.tagName])
    data = data.map(v => v.meta)

    await loop(updateTemplateAndAttrs, data, false, { test: delFoods }) //
  } catch (error) {
    console.error(error)
  }
}

async function test_getHighbox() {
  try {

    // let [data, _] = await knx.raw(`SELECT *, r.cookie FROM foxx_food_manage f 
    //   LEFT JOIN foxx_shop_reptile r USING(wmpoiid)
    //   WHERE date = CURDATE() AND name LIKE '莲子椰汁西米露%'`)
    const cookie = await cookieMtRedis()
    // let data = await readXls('plan/0.01招牌芋圆修改前备份(2).xlsx', 'Sheet1')
    let data = await knx('foxx_shop_reptile').where({ status: 0 }).select()
    // let data = await readJson('log/log.json')
    // data = data.map(v => [cookie, v.shop_id, v.new_name, v.tagName])
    data = data.map(v => [cookie, v.wmpoiid])

    await loop(async (cookie, id) => {
      console.log(await new FallbackApp(id, cookie).food.getHighBoxPrice())
    }, data, false) //
  } catch (error) {
    console.error(error)
  }
}

async function test_substitute() {
  try {
    // const cookie = await cookieMtRedis()
    const cookie = "_lxsdk_cuid=17b09b195865b-00353994050c4-c501831-1fa400-17b09b19587c8; _lxsdk=17b09b195865b-00353994050c4-c501831-1fa400-17b09b19587c8; device_uuid=!4254ca0c-87b5-44aa-9855-47ebc3ccf297; uuid_update=true; acctId=78648864; token=0bMXqJMWosq9f9vOwFEM_cENQHyO6LQIrUtAZ5SEzfEU*; brandId=-1; wmPoiId=2700545; isOfflineSelfOpen=0; city_id=999999; isChain=0; existBrandPoi=false; ignore_set_router_proxy=false; region_id=2000000001; region_version=1522822151; newCategory=false; bsid=-L-xy-ybMWpJ4-qRmap_r1bKkmzo0qjT2P_3ADlPWjLWeeX19jy6EZdr49VH3MH-989iVO75YdPiBOPMBC9xTw; cityId=440300; provinceId=440000; city_location_id=10000004; location_id=10000005; pushToken=0bMXqJMWosq9f9vOwFEM_cENQHyO6LQIrUtAZ5SEzfEU*; labelInfo=20210901:0:0; set_info=%7B%22wmPoiId%22%3A2700545%2C%22region_id%22%3A%222000000001%22%2C%22region_version%22%3A1522822151%7D; wpush_server_url=wss://wpush.meituan.com; shopCategory=food; JSESSIONID=3fbhrtr10v2q1cvuts0ol8kkg; logan_session_token=b7t2zb1l4ruvnf5am4gs; _lxsdk_s=17be875287a-22b-c44-e8f%7C78648864%7C34"

    console.log(await substituteFood(cookie, 2700545, '饮料汤羹', '芙蓉菌菇汤（需自备开水）',
      '饮料汤羹', '皮蛋粥（正餐）'
    ))
    // console.log(await delFoods())
  } catch (error) {
    console.error(error)
  }
}

// test_getTemp()
// test_stock()
// test_saveFood()
// test_updateAct()        -+
// test_createAct()
// test_move()
// test_delTag()
// test_updateWeight()
// test_updateMinOrder()
// test_updateTagName()
// test_updateTagUnTop()
// let date = new Date(2021, 1, 22, 3, 0, 0)
// console.log('task wiil be exec at', dayjs(date).format('YYYY-MM-DD HH:mm:ss'))
// let j = schedule.scheduleJob(date, async function() {
//   // await test_boxPrice()
//   await test_updateWeight()
// })

// test_testFood()
// test_autotask()
// test_sortTag()
// test_updateDesc()
// test_boxPrice()
// test_plan()
// test_updateMaterial()
// test_reduction2()
// test_delivery()
// test_reduction2()
// test_plan()
// test_delTag()
// test_delNewCustomer()
// test_rename()
// test_updateAct()
// test_delFoods()
// test_testFood()
// test_updateAttrs2()
// test_updateImg()
// test_rename()
// test_rename_pic()
// test_updateUnitC()
// test_lq()
// test_stock()
// test_getHighbox()
// test_substitute()