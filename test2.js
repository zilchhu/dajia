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

async function test_testFood() {
  let data = [1, 2, 3, 4, 5, 6, 7].map(v => [10085676, v])
  await loop(createTest, data, false)
}

async function test_saveFood() {
  try {
    let data = await readXls('plan/美团低质量产品1.18.xlsx', 'Sheet1')
    data = data
      .filter(v => v.份量 != '')
      .slice(45)
      .map((v, i) => [v.wmPoiId, v.name, v.份量, i])
    // let data = readJson('log/log.json')
    // data = data.map(v => v.meta)
    await loop(updateUnit, data, true, { test: delFoods })
  } catch (err) {
    console.error(err)
  }
}

async function updateFoodStock(id, name, stock = 10000) {
  const fallbackApp = await new FallbackApp(id)

  try {
    const food = await fallbackApp.food.find(name)
    let skuIds = food.wmProductSkus.map(v => v.id)
    const foodUpdateStockRes = await fallbackApp.food.batchUpdateStock(skuIds)
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
    const poiList = `8981943
    9153911
    9391341
    9470147
    8981890
    9258295
    9620939
    9492674
    8981920
    9636784
    9703463
    9732198
    9776028
    9927233
    9997882
    10038920
    10056855
    10096784
    10093423
    10076509
    10106799
    10372220
    10700120`
      .split('\n')
      .map(v => v.trim())

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
    const tag = tags.find(v => /.*店铺公告|门店公告|不要下单|别点了.*/.test(v.name))
    if (!tag) return Promise.reject({ err: 'tag not found' })
    const food = await fallbackApp.food.find(name)
    const res = await fallbackApp.food.batchUpdateTag(tag.id, [food.id])
    return res
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_move() {
  try {
    let data = await readXls('plan/雪花球重上.xlsm', '美团雪花球重上')
    data = data.map(v => [v.门店id, v.品名])
    await loop(moveFood, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function delFoods(id) {
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
    let tag = await fallbackApp.food.searchTag('❣️腊八专享套餐')
    return fallbackApp.food.delTag(tag.id)
  } catch (e) {
    return Promise.reject(e)
  }
}

async function test_delTag() {
  try {
    const fallbackApp = new FallbackApp()
    let data = await fallbackApp.poi.list()
    data = data.map(v => [v.id])
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
    const res = await fallbackApp.food.updateName(spuId, newName)
    return Promise.resolve({ res, newName })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_rename2() {
  try {
    let data = await readJson('log/log.json')
    data = data.filter(v => v.err.message == 'read ECONNRESET').map(v => v.meta)
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
    const { ok } = await fallbackApp.food.setHighBoxPrice(0, true)
    if (ok) {
      if (price) {
        let skus = [
          {
            price,
            wmProductLadderBoxPrice: boxPrice ? { ladder_num: 1, ladder_price: boxPrice, status: 1 } : null
          }
        ]
        const delActRes = await delAct(id, name)
        const minOrderCount = await fallbackApp.food.getMinOrderCount(name)
        const updateSkusRes = await batchUpdateFoodSkus(id, name, skus)

        results.priceRes = {
          delActRes,
          updateSkusRes
        }

        if (minOrderCount != 1) {
          const saveRes = await fallbackApp.food.save(name, minOrder)
          results.priceRes.saveRes = saveRes
        }

        if (!delActRes.noAct) {
          const createActRes = await createAct(id, name, delActRes.actPrice, delActRes.orderLimit)
          results.createActRes.createActRes = createActRes
        }
      }

      if (boxPrice) {
        const boxPriceRes = await updateFoodBoxPrice(id, name, boxPrice)
        results.boxPriceRes = boxPriceRes
      }

      if (actPrice) {
        const delActRes = await delAct(id, name)
        const actPriceRes = await createAct(id, name, actPrice, delActRes.orderLimit)
        results.actPriceRes = actPriceRes
      }

      if (orderLimit) {
        const delActRes = await delAct(id, name)
        const orderLimitRes = await createAct(id, name, delActRes.actPrice, orderLimit)
        results.orderLimitRes = orderLimitRes
      }

      if (minOrder) {
        const minOrderRes = await fallbackApp.food.save(name, minOrder)
        results.minOrderCount = minOrderRes
      }

      return Promise.resolve(results)
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_plan() {
  try {
    let dataSource6 = await readXls('plan/福袋添加餐盒费2.xls', '美团餐品规则')
    dataSource6 = dataSource6.map((v, i) => [v.门店id, v.品名, 2, i])
    await loop(updateFoodBoxPrice, dataSource6, false, { test: delFoods })

    let dataSource7 = await readXls('plan/美团单产品起送餐品.xls', '美团餐品规则')
    dataSource7 = dataSource7.map((v, i) => [v.门店id, v.品名, 14.9 - parseFloat(v.餐盒费), v.餐盒费, i])
    await loop(updateFoodSku, dataSource7, false, { test: delFoods })

    let dataSource = await readXls('plan/美团贡茶修改1-22.xlsx', '原价13.8+餐盒费1')
    dataSource = dataSource.map((v, i) => [v.门店id, v.产品名, 13.8, 1, i]).slice(dataSource.length - 583)
    await loop(updateFoodSku, dataSource, false, { test: delFoods })

    let dataSource2 = await readXls('plan/美团贡茶修改1-22.xlsx', '原价6.9+餐盒0.5')
    dataSource2 = dataSource2.map((v, i) => [v.门店id, v.产品名, 6.9, 0.5, i])
    await loop(updateFoodSku, dataSource2, false, { test: delFoods })

    let dataSource3 = await readXls('plan/美团甜品修改1-22.xlsx', '原价6.4+餐盒1')
    dataSource3 = dataSource3.map((v, i) => [v.门店id, v.产品名, 6.4, 1, i])
    await loop(updateFoodSku, dataSource3, false, { test: delFoods })

    let dataSource4 = await readXls('plan/美团甜品修改1-22.xlsx', '原价12.8+餐盒1')
    dataSource4 = dataSource4.map((v, i) => [v.门店id, v.产品名, 12.8, 1, i])
    await loop(updateFoodSku, dataSource4, false, { test: delFoods })

    let dataSource5 = await readXls('plan/美团甜品修改1-22.xlsx', '原价6.9+餐盒0.5')
    dataSource5 = dataSource5.map((v, i) => [v.门店id, v.产品名, 6.9, 0.5, i])
    await loop(updateFoodSku, dataSource5, false, { test: delFoods })
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
    let data = await readXls('plan/美团折扣修改.xls', '折扣价12.8')
    data = data.map(v => [v.id, v.产品名, 12.8])
    await loop(updateAct, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_createAct() {
  try {
    let data = await readXls('plan/活动修改(1)(1)(1)(1)(1)(1).xlsx', 'Sheet4')
    // let data = readJson('log/log.json')

    data = data.map(v => [v.id, v.name, v.折扣])
    // data = data.map(v => v.meta)
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
    return Promise.resolve({ res, res2 })
  } catch (e) {
    return Promise.reject(e)
  }
}

async function test_reduction2() {
  try {
    let data = await readXls('plan/改满减(2)(1).xlsx', 'Sheet2')
    data = data.map(v => ({
      ...v,
      reduc: [
        {
          discounts: [
            {
              code: 1,
              discount: '15-6'.split('-')[1],
              poi_charge: '15-6'.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: '15-6'.split('-')[0]
        },
        {
          discounts: [
            {
              code: 1,
              discount: '30-10'.split('-')[1],
              poi_charge: '30-10'.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: '30-10'.split('-')[0]
        },
        {
          discounts: [
            {
              code: 1,
              discount: '45-16'.split('-')[1],
              poi_charge: '45-16'.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: '45-16'.split('-')[0]
        },
        {
          discounts: [
            {
              code: 1,
              discount: '60-20'.split('-')[1],
              poi_charge: '60-20'.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: '60-20'.split('-')[0]
        },
        {
          discounts: [
            {
              code: 1,
              discount: '100-30'.split('-')[1],
              poi_charge: '100-30'.split('-')[1],
              agent_charge: 0,
              type: 'default',
              mt_charge: 0
            }
          ],
          price: '100-30'.split('-')[0]
        }
      ]
    }))
    data = data.map(v => [v['id'], null, null, v['reduc']])
    await loop(saveReduction, data, false)
  } catch (error) {
    console.error(error)
  }
}

async function test_updateTagName() {
  try {
    let data = await readXls('plan/hh美团店铺分类更改.xlsx', 'hh美团店铺id')
    data = data.filter(v => v.修改后 != '').map(v => [v.店铺ID, v.tagname.replace(/—.*—|┏.*┓|\?|╭.*╮/, ''), v.修改后])
    await loop(updateFoodCatName, data, false)
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

async function test_updateMaterial() {
  try {
    const fallbackApp = new FallbackApp()
    let data = await fallbackApp.poi.list()
    data = data.filter(v => v.poiName.includes('茶')).map(v => [v.id, '小试“牛”刀福袋'])
    await loop(updateFoodMater, data, true)
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
    const fallbackApp = new FallbackApp(10085676)
    console.log(await fallbackApp.food.save('双蛋烤冷面', 2, '1人份', '鸡蛋'))
  } catch (error) {
    console.error(error)
  }
}
// test_saveFood()
// test_updateAct()
// test_createAct()

// let date = new Date(2021, 0, 28, 3, 0, 0)
// console.log('task wiil be exec at', date)
// let j = schedule.scheduleJob(date, async function() {
//   await test_plan()
// })

// test_testFood()
test_autotask()

// test_plan()
// test_updateMaterial()

// test_dieliver()
// test_reduction2()
// test_plan()
// test_delTag()
// test_delNewCustomer()
// test_rename()
// test_updateAct()1
// test_delFoods()
// test_testFood()
// test_rename2()
// test_updateImg()
