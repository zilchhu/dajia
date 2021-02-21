import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import flatten from 'flatten'
import dayjs from 'dayjs'

function omit(obj, ks) {
  let newKs = Object.keys(obj).filter(v => !ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

import knex from 'knex'
import { readXls } from './fallback/fallback_app.js'
const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai'
  }
})

async function t() {
  try {
    const r = await knx('foxx_operating_data')
      .select()
      .where({ date: 20210202 })

    const d = Array.from(new Set(r.map(v => v.shop_name))).map(v => r.find(k => k.shop_name == v))
    await knx('foxx_operating_data')
      .where({ date: 20210219 })
      .del()
    console.log(await knx('foxx_operating_data').insert(d))

    // const r = await knx('foxx_operating_data').select()
    // let cnt = r.length
    // for (let r0 of r) {
    //   console.log(cnt)
    //   try {
    //     await knx('test_analyse_t_')
    //       .where({ shop_name: r0.shop_name, date: r0.date, platform: r0.platform })
    //       .update({ unit_price: r0.unit_price })
    //   } catch (e) {
    //     console.error(e)
    //   }
    //   cnt -= 1
    // }
  } catch (e) {
    console.error(e)
  }
}

t()