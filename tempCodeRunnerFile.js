import jieba from '@node-rs/jieba'
import knex from 'knex'
import fs from 'fs'

import { readXls } from './fallback/fallback_app.js'

jieba.load()

const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai'
  }
})

async function a() {
  let b = `豪华台湾手抓饼【三拼】$
  绿豆沙/红豆沙$
  火腿烤冷面$
  火山石烤纯肉肠【肉肉哦】$
  招牌烧仙草(超多料在里面)$
  芋圆椰奶烧仙草(不点后悔终身)$
  招牌芋圆(店长推荐)$
  日式章鱼小丸子4个【风靡】$
  (至尊)木瓜雪耳桃胶炖椰奶$
  招牌双皮奶.$
  芋圆椰汁西米露$
  香港车仔面【必抢】$
  台湾盐酥鸡$【必抢】
  正宗重庆酸辣粉【麻辣酸爽】$
  芋圆红豆双皮奶.$
  芝士焗番薯
  酱拌刀削面【必抢】$
  乌冬面【热销】$
  台湾手抓饼【三拼】
  台湾手抓饼【双拼】
  台湾盐酥鸡.
  吮指脆皮鸡腿.$
  培根烤冷面.
  招牌烧仙草(店长推荐)
  招牌芋圆(人气第一)
  清水汤圆(8颗)$
  炸墨鱼丸.$
  红豆双皮奶.
  绿豆沙.$
  芋圆绿豆沙.
  金牌奥尔良烤翅(对翅)$`
    .split('\n')
    .map(v => v.trim())
  try {
    let data = await knx('foxx_food_cost_info')
      .select()
      .whereIn('food_name', b)

    console.log(b.map(v => data.find(k => k.food_name == v).food_price || '').join('\n'))
  } catch (error) {
    console.error(error)
  }
}

a()
