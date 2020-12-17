import App from './index.js'
import FallbackApp from './fallback/fallback_app.js'
import log from './log/log.js'
import dayjs from 'dayjs'
import xls2json from 'xls-to-json'
import util from 'util'
import fs from 'fs'
const axls2Json = util.promisify(xls2json)
import sleep from 'sleep-promise'

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
        discounts: [
          { code: 1, discount: 6, poi_charge: 6, agent_charge: 0, type: 'default', mt_charge: 0 }
        ],
        price: 15
      },
      {
        discounts: [
          { code: 1, discount: 12, poi_charge: 12, agent_charge: 0, type: 'default', mt_charge: 0 }
        ],
        price: 30
      },
      {
        discounts: [
          { code: 1, discount: 16, poi_charge: 16, agent_charge: 0, type: 'default', mt_charge: 0 }
        ],
        price: 45
      },
      {
        discounts: [
          { code: 1, discount: 20, poi_charge: 20, agent_charge: 0, type: 'default', mt_charge: 0 }
        ],
        price: 60
      },
      {
        discounts: [
          { code: 1, discount: 30, poi_charge: 30, agent_charge: 0, type: 'default', mt_charge: 0 }
        ],
        price: 100
      }
    ]

    let e = await axls2Json({
      input: `plan/12月8号批量改贡茶价格.xlsx`,
      sheet: 'Sheet4',
      output: `plan/12月8号批量改贡茶价格.xlsx.json`
    })
    // let shopIds = Array.from(new Set(e.map(v => v.id)))
    let shopIds = `9543728
    10156945
    9411129
    10083564
    10014983
    9596488
    10427603
    9224233
    10045394
    9861088
    7740255
    7735904
    10456106
    7779873
    8911549
    8221674
    7632277
    9100878
    9411146
    9249572
    9355348
    10307635
    9576423
    6950373
    7968147
    7351446
    9842782
    9014461
    8051354
    9236042
    7673028
    8751302
    6434760
    8890748
    8670629`
      .split('\n')
      .map(v => v.trim())
    for (let id of shopIds) {
      try {
        console.log(id)
        const saveReductionRes = await saveReduction(id, null, null, policyDetail)
        console.log(saveReductionRes)
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
    const foodUpdatePriceRes = await fallbackApp.food.updatePrice(
      foodWillUpdatePrice.wmProductSkus[0].id,
      price
    )
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
    const food = await fallbackApp.food.find(name)
    const updateBoxPriceRes = await fallbackApp.food.batchUpdateBoxPrice(
      food.wmProductSkus.map(v => v.id),
      boxPrice
    )
    return updateBoxPriceRes
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
          wmProductLadderBoxPrice:
            sku.wmProductLadderBoxPrice || food.wmProductSkus[i].wmProductLadderBoxPrice
        }
      })
    else
      skus = skus.map(sku => {
        return {
          weight_unit: sku.weight_unit || food.wmProductSkus[0].weightUnit,
          weight: sku.weight || food.wmProductSkus[0].weight,
          price: sku.price || food.wmProductSkus[0].price,
          stock: sku.stock || food.wmProductSkus[0].stock,
          wmProductLadderBoxPrice:
            sku.wmProductLadderBoxPrice || food.wmProductSkus[0].wmProductLadderBoxPrice
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
      const saveReductionRes = await fallbackApp.act.reduction.save(
        reduction.id,
        startTime,
        endTime,
        poiPolicy
      )
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
      const saveReductionRes = await fallbackApp.act.reduction.save(
        null,
        startTime,
        endTime,
        poiPolicy
      )
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
    if (actIds.length == 0) return
    const actDelRes = await fallbackApp.act.delete(actIds)
    return actDelRes
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

    const actCreateRes = await fallbackApp.act.create(
      wmSkuId,
      name,
      originPrice,
      actPrice,
      orderLimit
    )
    const foodCreatedActRes = await fallbackApp.act.find(name)
    return {
      ...actCreateRes.map(actC => actC.result),
      foodCreatedAct: {
        ...JSON.parse(foodCreatedActRes.actInfo),
        orderLimit: foodCreatedActRes.orderLimit
      }
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_price() {
  let e = await axls2Json({
    input: `-- 美团单折扣商品起送查询2(2).xlsx`,
    sheet: 'Sheet1',
    output: `-- 美团单折扣商品起送查询2(2).xlsx.json`
  })
  // let e = JSON.parse(fs.readFileSync('log/log2.json'))
  // let shopIds = Array.from(new Set(e.map(v => v.id)))
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

async function createTest(id) {
  const fallbackApp = new FallbackApp(id)

  try {
    // 店铺公告 门店公告 不要下单 别点了
    const tag = await fallbackApp.food.searchTag('别点了')
    const foods = await fallbackApp.food.listFoods(tag.id)
    if (!foods.find(v => v.name == '饺子、冬至、汤圆')) {
      const createTestFoodRes = await fallbackApp.food.createTestFood(tag.id, tag.name)
      return Promise.resolve({ createTestFoodRes, tagName: tag.name })
    } else {
      return Promise.resolve('have been created')
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

async function updateImg(id) {
  const fallbackApp = new FallbackApp(id)

  try {
    const food = await fallbackApp.food.find('饺子、冬至、汤圆')
    const foodUpdateImgRes = await fallbackApp.food.updateImg(food.id, 'http://p1.meituan.net/wmproduct/382db61cf2707f5b69698051a2a94756401785.png')
    return Promise.resolve({foodUpdateImgRes, foodId: food.id, foodName: food.name})
  } catch (err) {
    return Promise.reject(err)
  }
}

async function test_testFood() {
  const fallbackApp = new FallbackApp()

  try {
    // const poiList = await fallbackApp.poi.list()
    const poiList = JSON.parse(fs.readFileSync('log/log.json')).map(v => v.shop)
    for (let shop of poiList) {
      console.log(shop.id, shop.name)
      try {
        const createTestFoodRes = await createTest(shop.id)
        console.log(createTestFoodRes)
        // await sleep(6000)
      } catch (err) {
        console.error(err)
        log({ shop: { id: shop.id, name: shop.name }, err })
      }
    }
  } catch (err) {
    console.error(err)
  }
}

async function test() {
  const fallbackApp = new FallbackApp()

  try {
    let poiList = await fallbackApp.poi.list()
    poiList = poiList.filter(v=>v.poiName.includes('贡茶'))
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

test()
