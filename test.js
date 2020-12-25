import jieba from '@node-rs/jieba'
import knex from 'knex'
import fs from 'fs'

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
    let [data, _] = await knx.raw(`SELECT name,count(name) as count
    from foxx_food_manage
    where date=curdate() 
    group by name
    ORDER BY count`)
    fs.appendFileSync('a.json', JSON.stringify(data))
  } catch (error) {
    console.error(error)
  }
}

function b() {
  try {
    let a = JSON.parse(fs.readFileSync('a.json'))

    a = a.map(v=>({
      ...v,
      tag: t(v.name)
    }))

    fs.writeFileSync('a.json', JSON.stringify(a))
  } catch (error) {
    console.error(error)
  }

  function t(v) {
    return jieba.tag(v)
  }
}

b()

