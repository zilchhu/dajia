import jieba from '@node-rs/jieba'
import fs from 'fs'
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

jieba.loadDict(fs.readFileSync('user2.dict'))

async function t() {
  try {
    const [res, _] = await knx.raw(
      `WITH a1 AS (
        SELECT name FROM foxx_food_manage 
        WHERE date = CURDATE() AND wmpoiid IN (SELECT id FROM mt_shops_ WHERE name LIKE '%贡茶%')
        GROUP BY name
      ),
      a2 AS (
        SELECT name FROM foxx_food_manage 
        WHERE date = CURDATE() AND wmpoiid IN (SELECT id FROM mt_shops_ WHERE name LIKE '%甜品%')
        GROUP BY name 
      ),
      b1 AS (
        SELECT name FROM ele_food_manage 
        WHERE DATE(insert_date) = CURDATE() AND shop_id IN (SELECT id FROM elm_shops_ WHERE name LIKE '%贡茶%')
        GROUP BY name
      ),
      b2 AS (
        SELECT name FROM ele_food_manage 
        WHERE DATE(insert_date) = CURDATE() AND shop_id IN (SELECT id FROM elm_shops_ WHERE name LIKE '%甜品%')
        GROUP BY name
      ),
      c AS (
        SELECT DISTINCT(name) FROM (SELECT name FROM a1 UNION SELECT name FROM b1) w
      ),
      d AS (
        SELECT DISTINCT(name) FROM (SELECT name FROM a2 UNION SELECT name FROM b2) q
      )
      SELECT name FROM c`
    )
    console.log(res)
  } catch (err) {
    console.error(err)
  }
}

// name amount discount / dec 
