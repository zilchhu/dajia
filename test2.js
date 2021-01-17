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
      return saveReductionRes
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

async function updateImg(id) {
  const fallbackApp = new FallbackApp(id)

  try {
    const food = await fallbackApp.food.find('饺子、冬至、汤圆')
    const foodUpdateImgRes = await fallbackApp.food.updateImg(
      food.id,
      'http://p1.meituan.net/wmproduct/382db61cf2707f5b69698051a2a94756401785.png'
    )
    return Promise.resolve({ foodUpdateImgRes, foodId: food.id, foodName: food.name })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_testFood() {
  const fallbackApp = new FallbackApp()

  try {
    // const poiList = await fallbackApp.poi.list()
    let data = [3, 4, 5, 6, 7].map(v => [9470231, v])
    await loop(createTest, data, false)
  } catch (err) {
    console.error(err)
  }
}

async function test_updateImg() {
  const fallbackApp = new FallbackApp()

  try {
    let poiList = await fallbackApp.poi.list()
    poiList = poiList.filter(v => v.poiName.includes('贡茶'))
    for (let shop of poiList) {
      console.log(shop.id, shop.poiName)
      try {
        const updateImgRes = await updateImg(shop.id)
        console.log(updateImgRes)
        // await sleep(8000)
      } catch (err) {
        console.error(err)
        log({ shop: { id: shop.id, name: shop.poiName }, err })
      }
    }
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
    const poiList = await new FallbackApp().poi.list()

    let cnt = poiList.length

    for (let poi of poiList) {
      const { id, poiName } = poi
      const fallbackApp = new FallbackApp(id)

      console.log(id, poiName, cnt)

      let foods = await knx('foxx_food_manage')
        .select()
        .whereRaw('date = curdate()')
        .andWhere({ wmpoiid: id })

      foods = foods.filter(f => f.name.includes('0元吃'))
      for (let food of foods) {
        try {
          let spuId = food.productId
          let spuName = food.name.replace('0元吃', '0元购')
          const foodUpdateNameRes = await fallbackApp.food.updateName(spuId, spuName)
          console.log({ foodUpdateNameRes, poiName, spuName })
          // await sleep(8000)
        } catch (err) {
          console.error(err)
          log({ shop: { id, poiName }, err })
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
        if (id == 9470231) continue
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

      const updateSkusRes = await batchUpdateFoodSkus(id, name, skus)

      // const testsRes = await delFoods(id)

      if (delActRes.noAct) {
        // const testsRes = await delFoods(id)
        return Promise.resolve({ delActRes, updateSkusRes })
      }

      const createActRes = await createAct(id, name, delActRes.actPrice, delActRes.orderLimit)
      // const sortActRes = await fallbackApp.act.sort(name, 30)

      return Promise.resolve({ delActRes, updateSkusRes, createActRes })
    } else return Promise.reject({ err: 'sync failed' })
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_plan() {
  try {
    let dataSource = await readXls('plan/美团贡茶修改.xlsx', '修改原价13.8+1')
    dataSource = dataSource.slice(dataSource.length - 148)
      .map((v, i) => [v.门店id, v.品名, 13.8, 1, i])
    await loop(updateFoodSku, dataSource, false, { test: delFoods })
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
    // let data = await readXls('plan/雪花球重上.xlsm', '美团雪花球重上')
    let data = await readJson('log/log.json')
    data = data.map(v => v.meta)
    await loop(createAct, data, false)
  } catch (error) {
    console.error(error)
  }
}

// 231
async function test() {
  try {
    let data = await readXls('plan/美团批量修改.xlsx', '美团0.01增加餐盒费')
    data = data.map(v => [v.门店id, v.产品名, 1.5])
    await loop(updateFoodBoxPrice, data, true)
  } catch (error) {
    console.error(error)
  }
}

// test_updateAct()
test_plan()
// test_updateAct()1
// test_delFoods()
// test_testFood()
// test_rename2()
