import dayjs from 'dayjs'
import fs from 'fs'
import sleep from 'sleep-promise'
import xls2json from 'xls-to-json'
import util from 'util'

import App from './index.js'
import FallbackApp from './fallback/fallback_app.js'

const axls2Json = util.promisify(xls2json)

// let app_poi_code = '9470231'

async function plan1(name, price, act_price, box_price, min_order_count) {
  try {
    let food = foodList.find(v => v.name == name)
    if (food) {
      let app_food_code = food.app_food_code

      let skus = JSON.parse(food.skus)
      skus = skus.map((v, i) => ({
        ...v,
        spec: `${i}`,
        stock: '9999'
      }))

      const sku_id = '10020'
      skus.push({
        sku_id,
        spec: sku_id,
        price: price ? `${price}` : food.price,
        stock: '9999',
        box_num: '1',
        box_price: box_price ? `${box_price}` : food.box_price
      })

      let n = {
        description: food.description,
        category_name: food.category_name,
        tag_name: food.tag_name,
        name: food.name,
        skus: JSON.stringify(skus),
        price: price ? price : food.price,
        min_order_count: min_order_count ? min_order_count : food.min_order_count,
        unit: food.unit,
        box_num: food.box_num,
        box_price: box_price ? box_price : food.box_price,
        is_sold_out: food.is_sold_out,
        sequence: food.sequence
      }

      const acts = actList.filter(v => v.itemName == name)
      let act = acts.find(v => v.priority != 1200)

      if (price || box_price) {
        if (act) {
          let actIds = acts.map(v => v.id)
          console.log('- del act: ', actIds)
          const actDelete = await fallbackApp.act.delete(actIds)
          console.log('del act: ', actDelete)
          await sleep(1500)

          console.log('- add sku: ', n)
          let initData = await app.food.initdata(app_food_code, n)
          console.log('add sku: ', initData)
          await sleep(1500)

          console.log('- del sku: ', skus[0].sku_id)
          let skuData = await app.food.sku.delete(app_food_code, skus[0].sku_id)
          console.log('del sku: ', skuData)
          await sleep(1500)

          logAct(act)

          const charge = JSON.parse(act.charge)
          let actData = {
            ...act,
            ...charge,
            actPrice: act_price,
            id: null
          }
          console.log('- add act: ', actData)
          const actSave = await fallbackApp.act.save(actData)
          console.log('add act: ', actSave)
        } else {
          console.log('- add sku: ', n)
          let initData = await app.food.initdata(app_food_code, n)
          console.log('add sku: ', initData)
          await sleep(1500)

          console.log('- del sku: ', skus[0].sku_id)
          let skuData = await app.food.sku.delete(app_food_code, skus[0].sku_id)
          console.log('del sku: ', skuData)
          await sleep(1500)

          if (act_price) {
            let foods = await fallbackApp.food.search(name)
            if (!foods) {
            }
            food = foods.productList.find(v => v.name == name)
            const charge = {
              originPrice: price,
              actPrice: act_price,
              mtCharge: 0,
              agentCharge: 0
            }
            const act = {
              spuId: food.id,
              wmSkuId: food.wmProductSkus[0].id,
              itemName: name,
              orderLimit: -1,

              orderPayType: 2,
              todaySaleNum: -1,
              originId: 0,
              sortIndex: 0,
              settingType: '1',
              chargeType: '0',
              wmUserType: 0,
              poiUserType: '0'
            }
            let actData = {
              ...act,
              ...charge,
              actPrice: act_price,
              id: null
            }
            console.log('- add act: ', actData)
            const actSave = await fallbackApp.act.save(actData)
            console.log('add act: ', actSave)
          }
        }
      } else if (actPrice) {
        if (act) {
          logAct(act)

          const charge = JSON.parse(act.charge)
          let actData = {
            ...act,
            ...charge,
            actPrice: act_price
            // id: null
          }
          console.log('- save act: ', actData)
          const actSave = await fallbackApp.act.save(actData)
          console.log('save act: ', actSave)
        } else {
          let foods = await fallbackApp.food.search(name)
          if (!foods) {
            throw new Error('failed at search')
          }
          food = foods.productList.find(v => v.name == name)
          const charge = {
            originPrice: price,
            actPrice: act_price,
            mtCharge: 0,
            agentCharge: 0
          }
          const act = {
            spuId: food.id,
            wmSkuId: food.wmProductSkus[0].id,
            itemName: name,
            orderLimit: -1,

            orderPayType: 2,
            todaySaleNum: -1,
            originId: 0,
            sortIndex: 0,
            settingType: '1',
            chargeType: '0',
            wmUserType: 0,
            poiUserType: '0'
          }
          let actData = {
            ...act,
            ...charge,
            actPrice: act_price,
            id: null
          }
          console.log('- add act: ', actData)
          const actSave = await fallbackApp.act.save(actData)
          console.log('add act: ', actSave)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function plan2(name, price, act_price, box_price, min_order_count) {}

async function plansByPoi(plan) {
  try {
    const app_poi_code = plan.shopId
    const plans = plan.plans
    const app = new App(app_poi_code)
    const fallbackApp = new FallbackApp(app_poi_code)
    const foodList = await app.food.list()
    const actList = await fallbackApp.act.list()
    for (let p of plans) {
      try {
        const name = p.商品
        const price = p.改后原价.length > 0 ? parseFloat(p.改后原价) : null
        const act_price = p.折扣价.length > 0 ? parseFloat(p.折扣价) : null
        const box_price = p.改后餐盒费.length > 0 ? parseFloat(p.改后餐盒费) : null
        const min_order_count = p.起购数.length > 0 ? parseInt(p.起购数) : null

        await plan1(name, price, act_price, box_price, min_order_count)
      } catch (error) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function plans2() {
  let e = await axls2Json({
    input: `plan/-- 美团单折扣商品起送查询2.xlsx`,
    sheet: '-- 美团单折扣商品起送查询2',
    output: `plan/-- 美团单折扣商品起送查询2.json`
  })
  let shopIds = Array.from(new Set(e.map(v => v.wmpoiid)))

  let plans = shopIds.map(id => ({
    shopId: id,
    plans: e.filter(v => v.wmpoiid == id)
  }))

  let poiIds = new App().poi.getids()

  for (let plan of plans) {
    if (poiIds.includes(plan.shopId)) {
      await plansByPoi(plan)
    }
  }

  // await plansByPoi(app_poi_code)
}

plans2()

// test()

// plans()

// test()

// console.log(dayjs.unix(1607184000).format('YYYYMMDD HH:mm:ss'))
