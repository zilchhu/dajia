import App from './index.js'
import FallbackApp, { loop, wrap, readJson, readXls } from './fallback/fallback_app.js'
import log from './log/log.js'
import dayjs from 'dayjs'
import xls2json from 'xls-to-json'
import util from 'util'
import fs from 'fs'
const axls2Json = util.promisify(xls2json)
import sleep from 'sleep-promise'
import knex from 'knex'
import schedule from 'node-schedule'
import flatten from 'flatten'

const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai'
  }
})

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

async function updateFoodPrice(id, name, price) {
  // const app = new App(id)
  const fallbackApp = new FallbackApp(id)

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

async function updateFoodBoxPrice(id, name, boxPrice) {
  // const app = new App(id)
  const fallbackApp = new FallbackApp(id)

  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice(0, true)
    if (ok) {
      const food = await fallbackApp.food.find(name)
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

async function batchUpdateFoodSkus(id, name, skus) {
  const fallbackApp = new FallbackApp(id)

  try {
    const food = await fallbackApp.food.find(name)

    if (food.wmProductSkus.length >= skus.length)
      skus = skus.map((sku, i) => {
        return {
          weight_unit: sku.weight_unit || food.wmProductSkus[i].weightUnit,
          weight: sku.weight || food.wmProductSkus[i].weight,
          price: sku.price || food.wmProductSkus[i].price,
          stock: sku.stock || food.wmProductSkus[i].stock,
          wmProductLadderBoxPrice: sku.wmProductLadderBoxPrice || food.wmProductSkus[i].wmProductLadderBoxPrice
        }
      })
    else
      skus = skus.map(sku => {
        return {
          weight_unit: sku.weight_unit || food.wmProductSkus[0].weightUnit,
          weight: sku.weight || food.wmProductSkus[0].weight,
          price: sku.price || food.wmProductSkus[0].price,
          stock: sku.stock || food.wmProductSkus[0].stock,
          wmProductLadderBoxPrice: sku.wmProductLadderBoxPrice || food.wmProductSkus[0].wmProductLadderBoxPrice
        }
      })
    console.log(food.wmProductSkus.map(v => v.id))
    const batchUpdateSkusRes = await fallbackApp.food.batchUpdateSkus(
      [food.id],
      food.wmProductSkus.map(v => v.id),
      skus
    )
    return batchUpdateSkusRes
  } catch (err) {
    return Promise.reject(err)
  }
}

async function saveReduction(id, startTime, endTime, policyDetail) {
  const fallbackApp = new FallbackApp(id)

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
    } else {
      // const delReductionRes = await fallbackApp.act.reduction.delete()
      startTime = dayjs()
        .startOf('day')
        .unix()
      endTime = dayjs()
        .startOf('day')
        .add(365, 'day')
        .unix()
      poiPolicy = {
        online_pay: 1,
        policy_detail: policyDetail
      }
      const saveReductionRes = await fallbackApp.act.reduction.save(null, startTime, endTime, poiPolicy)
      return Promise.resolve(saveReductionRes)
    }
    // console.log(poiPolicy)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function delTradein(id, name) {
  const fallbackApp = new FallbackApp(id)

  try {
    const trade = await fallbackApp.act.tradeIn.find(name)
    const delTradeinRes = await fallbackApp.act.tradeIn.delete([trade.id])
    return delTradeinRes
  } catch (err) {
    return Promise.reject(err)
  }
}

async function delAct(id, name) {
  const fallbackApp = new FallbackApp(id)
  try {
    const actListRes = await fallbackApp.act.list()
    const actListWillDel = actListRes.filter(act => act.itemName == name)
    const actIds = actListWillDel.map(act => act.id)
    if (actIds.length == 0) return { noAct: true }
    const actDelRes = await fallbackApp.act.delete(actIds)
    return Promise.resolve({
      actDelRes,
      actPrice: JSON.parse(actListWillDel[0].actInfo).act_price,
      orderLimit: actListWillDel[0].orderLimit
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function createAct(id, name, actPrice, orderLimit = -1) {
  const fallbackApp = new FallbackApp(id)

  try {
    const foodWillCreateAct = await fallbackApp.food.find(name)
    const wmSkuId = foodWillCreateAct.wmProductSkus[0].id
    const originPrice = foodWillCreateAct.wmProductSkus[0].price

    const actCreateRes = await fallbackApp.act.create(wmSkuId, name, originPrice, actPrice, orderLimit)
    const foodCreatedActRes = await fallbackApp.act.find(name)
    return Promise.resolve({
      ...actCreateRes.map(actC => actC.result),
      foodCreatedAct: {
        ...JSON.parse(foodCreatedActRes.actInfo),
        orderLimit: foodCreatedActRes.orderLimit
      }
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateAct(id, name, actPrice) {
  const fallbackApp = new FallbackApp(id)

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

async function logActs(id) {
  const fallbackApp = new FallbackApp(id)
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

async function updateActTime(id, act_str) {
  const fallbackApp = new FallbackApp(id)
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

async function test_act() {
  const fallbackApp = new FallbackApp()

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

async function createTest(id, ti) {
  const fallbackApp = new FallbackApp(id)

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

async function updateImg(id, foodId, newUrl) {
  const fallbackApp = new FallbackApp(id)
  try {
    const foodUpdateImgRes = await fallbackApp.food.updateImg(foodId, newUrl)
    return Promise.resolve(foodUpdateImgRes)
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateUnitC(id, name) {
  const fallbackApp = new FallbackApp(id)
  try {
    let { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      return fallbackApp.food.save2(name)
    } else return Promise.reject('sync failed')
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_updateImg() {
  try {
    let [data, _] = await knx.raw(`SELECT * FROM foxx_food_manage f WHERE date = CURDATE() AND  name  LIKE '%法式焦糖烤布蕾%'`)
    data = data.map(v=>[v.wmpoiid, v.productId, 'http://p0.meituan.net/wmproduct/71bba988cab3ffe2a7148732cced60d2814663.png'])
    await loop(updateImg, data, false)
  } catch (err) {
    console.log(err)
  }
}

async function test_updateUnitC() {
  try {
    let [data, _] = await knx.raw(`SELECT lq.* FROM test_mt_food_lq_ lq 
        WHERE code = 5
        ORDER BY lq.wmPoiId`)
    data = data.map((v, i) => [v.wmPoiId, v.name, i])
    await loop(updateUnitC, data, false, { test: delFoods })
  } catch (err) {
    console.log(err)
  }
}

async function updateUnit(id, name, unit) {
  const fallbackApp = new FallbackApp(id)
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

async function updateAttrs(id, name, attrs) {
  const fallbackApp = new FallbackApp(id)
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

async function updateAttrs2(id, name, desc) {
  const fallbackApp = new FallbackApp(id)
  try {
    // const { ok } = await fallbackApp.food.setHighBoxPrice(0, true)
    if (true) {
      const res = await fallbackApp.food.save2(name, null, null, desc)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_updateAttrs2() {
  try {
    // let attrs = [{ name: '温度', values: ['冷', '温热'] }]
    let data = await readXls('plan/美团（大计划民治店）商品描述.xlsx', '修改版')
    data = data.map(v => [9835112, v.商品名称.trim(), v.描述.trim()])
    await loop(updateAttrs2, data, true)
  } catch (e) {
    console.error(e)
  }
}

async function test_testFood() {
  let data = [1, 2, 3, 4, 5, 6, 7].map(v => [9620939, v])
  await loop(createTest, data, false)
}

async function test_saveFood() {
  try {
    let data = await readXls('plan/e5438b9c07eebfd888c4b82f29fbe61961952.xls', '门店商品')
    // const attrs = [
    //   { name: '温度', values: ['正常冰', '多冰', '少冰', '去冰'] },
    //   { name: '甜度', values: ['正常糖', '少糖', '半糖', '多糖'] }
    // ]
    const attrs = [
      { id: null, wm_product_spu_id: null, no: 0, name: '温度', value: '热' },
      { id: null, wm_product_spu_id: null, no: 0, name: '温度', value: '常温' },
      { id: null, wm_product_spu_id: null, no: 0, name: '温度', value: '正常冰' },
      { id: null, wm_product_spu_id: null, no: 0, name: '温度', value: '多冰' },
      { id: null, wm_product_spu_id: null, no: 0, name: '温度', value: '少冰' },
      { id: null, wm_product_spu_id: null, no: 0, name: '温度', value: '去冰' },
      { id: null, wm_product_spu_id: null, no: 1, name: '甜度', value: '正常糖' },
      { id: null, wm_product_spu_id: null, no: 1, name: '甜度', value: '多糖' },
      { id: null, wm_product_spu_id: null, no: 1, name: '甜度', value: '7分糖' },
      { id: null, wm_product_spu_id: null, no: 1, name: '甜度', value: '半糖' },
      { id: null, wm_product_spu_id: null, no: 1, name: '甜度', value: '3分糖' },
      { id: null, wm_product_spu_id: null, no: 1, name: '甜度', value: '无糖' }
    ]
    data = data.map((v, i) => [v.门店ID, v.商品名称, attrs.map(a => ({ ...a, wm_product_spu_id: v.商品ID })), i])
    // let data = readJson('log/log.json')
    // data = data.map(v => v.meta)
    await loop(updateAttrs, data, true, { test: delFoods })
  } catch (err) {
    console.error(err)
  }
}

async function updateFoodStock(id, name, stock = -1) {
  const fallbackApp = await new FallbackApp(id)

  try {
    const food = await fallbackApp.food.find(name)
    let skuIds = food.wmProductSkus.map(v => v.id)
    const foodUpdateStockRes = await fallbackApp.food.batchUpdateStock(skuIds, stock)
    return Promise.resolve({ foodUpdateStockRes, skuIds })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateFoodName(id, tagName, spuId, foodName, spuName) {
  const fallbackApp = new FallbackApp(id)

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

async function test_rename() {
  try {
    const poiList = `8981943`.split('\n').map(v => v.trim())

    let cnt = poiList.length

    for (let poi of poiList) {
      const fallbackApp = new FallbackApp(poi)

      console.log(poi, cnt)

      let foods = await knx('foxx_food_manage')
        .select()
        .whereRaw('date = curdate()')
        .andWhere({ wmpoiid: poi })

      foods = foods.filter(f => f.name == '椰汁西米露')
      for (let food of foods) {
        try {
          let spuId = food.productId
          let spuName = '“牛”气福袋'
          const foodUpdateNameRes = await fallbackApp.food.updateName(spuId, spuName)
          console.log({ foodUpdateNameRes, poi, spuName })
          // await sleep(8000)
        } catch (err) {
          console.error(err)
          log({ shop: { poi }, err })
        }
      }

      cnt -= 1
    }
  } catch (err) {
    console.error(err)
  }
}

async function test_actPrice() {
  let dataSource = readJson('log/log.json')
  dataSource = dataSource.map(v => Object.values(v.meta))

  await loop(updateAct, dataSource)
}

async function updateTagSeq(id, name) {
  const fallbackApp = new FallbackApp(id)

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

async function updateTagTime(id, name) {
  const fallbackApp = new FallbackApp(id)

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

async function updateTagTop(id, name) {
  const fallbackApp = new FallbackApp(id)

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

async function updateTagUnTop(id, name) {
  const fallbackApp = new FallbackApp(id)

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
    dataSource = dataSource.map(v => [v.id, '甜糯汤圆'])

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

async function updateFoodCatName(id, tagName, newTagName) {
  try {
    const fallbackApp = new FallbackApp(id)
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

async function moveFood(id, name) {
  const fallbackApp = new FallbackApp(id)

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

export async function delFoods(id) {
  const fallbackApp = new FallbackApp(id)

  try {
    let tags = await fallbackApp.food.listTags()
    tags = tags.filter(v => v.name.includes('店铺公告'))
    let results = []
    for (let tag of tags) {
      try {
        if (id == 9470231 || id == 10085676) continue
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
  } catch (err) {
    return Promise.reject(err)
  }
}

async function delTag(id) {
  const fallbackApp = new FallbackApp(id)
  try {
    let tag = await fallbackApp.food.searchTag('牛年套餐')
    return fallbackApp.food.delTag(tag.id)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function test_delTag() {
  try {
    let data = `8828359
   9842782
   8751302
   8890748
   7673028
   9411129
   7779873
   7735904
   9014461
   8670629
   9411146
   8221674
   6434760
   6950373
   7968147
   7740255
   10014983
   9100878
   9224233
   9249572
   10693363
   9355348
   10083564
   9861088
   9236042`
      .split('\n')
      .map(v => v.trim())
    data = data.map(v => [v])
    await loop(delTag, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_delFoods() {
  try {
    // let fallbackApp = new FallbackApp()
    // let data = await fallbackApp.poi.list()
    // data = data.map(v => [v.id])
    await loop(delFoods, [[9993224]], false)
  } catch (error) {
    console.log(error)
  }
}

async function renameFood(id, spuId, oldName, newName) {
  const fallbackApp = new FallbackApp(id)

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

async function updateFoodSku(id, name, price, boxPrice) {
  const fallbackApp = new FallbackApp(id)

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

async function updatePlan(id, name, minOrder, price, boxPrice, actPrice, orderLimit) {
  const fallbackApp = new FallbackApp(id)
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

export async function updatePlan2(id, cateName, name, minOrder, price, boxPrice, actPrice, orderLimit) {
  const fallbackApp = new FallbackApp(id)
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

async function updatePlan3(id, name) {
  const fallbackApp = new FallbackApp(id)
  try {
    const { ok } = await fallbackApp.food.setHighBoxPrice2()
    if (ok) {
      const saveRes = await fallbackApp.food.save3(name, null)
      return Promise.resolve(saveRes)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateNotDeliverAlone(id, name) {
  const fallbackApp = new FallbackApp(id)
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
    let data = await readXls('plan/武广价格.xlsx', 'hh美团产品名带折扣')
    data = data
      .map((v, i) => [
        9535472,
        v.tagName,
        v.food_name,
        null,
        v.原价修改 == '' ? null : v.原价修改,
        null,
        v.折扣价修改 == '' ? null : v.折扣价修改,
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

async function delNewCustAct(id) {
  const fallbackApp = new FallbackApp(id)
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

async function delDieliverAct(id) {
  const fallbackApp = new FallbackApp(id)
  try {
    const act = await fallbackApp.act.dieliver.find()
    return fallbackApp.act.dieliver.delete(act.id)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function createDieliverAct(id, fee) {
  const fallbackApp = new FallbackApp(id)
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
    let data = await readXls('plan/择优改满减(1)(1).xlsx', 'Sheet3')
    data = data.map(v => ({
      ...v,
      reduc: [
        {
          discounts: [
            {
              code: 1,
              discount: v.满减档位1.split('-')[1],
              poi_charge: v.满减档位1.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: v.满减档位1.split('-')[0]
        },
        {
          discounts: [
            {
              code: 1,
              discount: v.满减档位2.split('-')[1],
              poi_charge: v.满减档位2.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: v.满减档位2.split('-')[0]
        },
        {
          discounts: [
            {
              code: 1,
              discount: v.满减档位3.split('-')[1],
              poi_charge: v.满减档位3.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: v.满减档位3.split('-')[0]
        },
        {
          discounts: [
            {
              code: 1,
              discount: v.满减档位4.split('-')[1],
              poi_charge: v.满减档位4.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: v.满减档位4.split('-')[0]
        },
        {
          discounts: [
            {
              code: 1,
              discount: v.满减档位5.split('-')[1],
              poi_charge: v.满减档位5.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: v.满减档位5.split('-')[0]
        }
      ]
    }))
    data = data.map(v => [v['店铺id'], null, null, v['reduc']])
    await loop(saveReduction, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_delivery() {
  try {
    let data = `6119122
    8135116
    9155621
    2924399
    9306217
    8591999
    7449372
    8939455
    6914754
    9412662
    7180353
    8195835
    7552065
    8600359
    9271561
    8953861
    9134834
    7494614
    9062221
    8996740
    4799060
    9663962
    9771558
    10028591
    9959091
    10039526
    10096975
    10049050
    10065090
    10159750
    10711763
    6434760
    8751302
    7673028
    9411129
    8828359
    7735904
    9014461
    8670629
    9236042
    8890748
    8221674
    9100878
    9249572
    9355348
    6950373
    9842782
    10083564
    10014983`
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

async function updateFoodMater(id, name) {
  try {
    const fallbackApp = new FallbackApp(id)
    return fallbackApp.food.save(name, null, null, '椰果')
  } catch (e) {
    return Promise.reject(e)
  }
}

async function updateFoodWeight(id, name, weight, unit) {
  const fallbackApp = new FallbackApp(id)
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

async function updateFoodMinOrder(id, name, minOrder) {
  const fallbackApp = new FallbackApp(id)
  try {
    const { ok } = { ok: true } // await fallbackApp.food.setHighBoxPrice(0, true)

    if (ok) {
      // const res = await fallbackApp.food.save(name, minOrder)
      const res = await fallbackApp.food.save2(name, null, minOrder)
      return Promise.resolve(res)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_updateMinOrder() {
  try {
    let data = await readJson('log/log.json')
    data = data.filter(v => v.err.err == 'pageModel null').map(v => v.meta)
    await loop(updateFoodMinOrder, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_autotask() {
  try {
    let tasks = {
      薯饼虾饼鸡柳无起购: async function() {
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
      两份起购餐盒费: async function() {
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
      两份起购无餐盒费: async function() {
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
      常规产品无餐盒费: async function() {
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
      非: async function() {
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
      原价餐盒凑起送: async function() {
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
      甜品粉面套餐: async function() {
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
      贡茶粉面套餐: async function() {
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
      除原价扣点加料价格: async function() {
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
      两份起购起购数: async function() {
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

async function test_stock(id) {
  try {
    let [data, _] = await knx.raw(`SELECT f.wmpoiid, reptile_type, name, stock FROM foxx_food_manage f 
    LEFT JOIN foxx_shop_reptile s ON f.wmpoiid = s.wmpoiid
    WHERE f.date = CURDATE()`)
    data = data.filter(v => v.wmpoiid != 10085676 && v.stock != -1).map(v => [v.wmpoiid, v.name, -1])

    await loop(updateFoodStock, data, false)
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

async function listLowQuals(id) {
  const fallbackApp = new FallbackApp(id)
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

// test_stock()
// test_saveFood()
// test_updateAct()
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
// test_updateAct()1
// test_delFoods()
// test_testFood()
// test_updateAttrs2()
// test_updateImg()
// test_updateUnitC()
// test_lq()
