import jieba from '@node-rs/jieba'
import knex from 'knex'
import fs from 'fs'

import {readXls} from './fallback/fallback_app.js'

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
  try {
    let data = await knx('foxx_food_cost_info').select()
    // let names = Array.from(new Set(data.map(v=>v.food_name)))
    // let new_data = names.map(name=>data.find(v=>v.food_name == name))
    // await knx('foxx_food_cost_info').del()
    // let res = await knx('foxx_food_cost_info').insert(new_data)
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

a()
