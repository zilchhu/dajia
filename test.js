import dayjs from 'dayjs'
import fs from 'fs'
import sleep from 'sleep-promise'
import xls2json from 'xls-to-json'
import util from 'util'

import App from './index.js'
import FallbackApp from './fallback/fallback_app.js'

const axls2Json = util.promisify(xls2json)

const app_poi_code = '9470231'
const app = new App(app_poi_code)
const fallbackApp = new FallbackApp(app_poi_code)

let foodList, actList

async function plan(name, price, act_price, box_price, min_order_count) {
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

      if (price) {
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
      }
    } else {
      console.log(foodList)
    }
  } catch (error) {
    console.error(error)
  }
}

async function plans() {
  foodList = await app.food.list()
  actList = await fallbackApp.act.list()
  // let planList = await axls2Json({
  //     input: `plan/plan\门店价格方案-美团甜品-坪山甜品.xlsx`,
  //     sheet: '喜三德（坪山店）',
  //     output: `plan/plan\门店价格方案-美团甜品-坪山甜品.xlsx`
  // })
  // console.log(actList)
  plan('招牌烧仙草【墙裂推荐】', 17, 10, null, null)
  return

  // let planList = JSON.parse(fs.readFileSync('plan/门店价格方案-美团甜品-至尊甜品.json'))

  for (let food of foodList) {
    let p = planList.find(plan => plan.产品名字.trim() == food.name)

    if (p) {
      let price = p.修改后原价.length > 0 ? parseFloat(p.修改后原价) : null
      let act_price = p.修改后折扣价.length > 0 ? parseFloat(p.修改后折扣价) : null
      let box_price = p.修改后餐盒费.length > 0 ? parseFloat(p.修改后餐盒费) : null
      let min_order_count = p.修改后最小起送量.length > 0 ? parseInt(p.修改后最小起送量) : null

      if (price || act_price || box_price || min_order_count) {
        console.log()
        console.log(food.name)
        console.log()
        plan(food.name, price, act_price, box_price, min_order_count)
        await sleep(5000)
      }
    }
  }
}

async function test() {
  const foodList = await app.food.list(0, 1)
  console.log(foodList)
}

// test()

plans()

// test()

// console.log(dayjs.unix(1607184000).format('YYYYMMDD HH:mm:ss'))
