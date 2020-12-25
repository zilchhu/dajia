import knex from 'knex'
import fs from 'fs'

const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai'
  }
})

async function main() {
  try {
    let day_from_today = 1
    let sql = `SELECT * FROM test_analyse_t_ WHERE date = DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL ${day_from_today} DAY),'%Y%m%d')`
    let [data, _] = await knx.raw(sql)

    let dayImprovements = data.map(record => ({
      id: record.id,
      person: record.person,
      shop_id: record.shop_id,
      shop_name: record.shop_name,
      platform: record.platform,
      a: JSON.parse(record.a)
    }))

    let persons = Array.from(new Set(dayImprovements.map(record => record.person)))

    let dayImprovementsByPerson = persons.map(person => ({
      person,
      improved: dayImprovements.filter(record => record.a != null),
      unimproved: dayImprovements.filter(record => record.a == null)
    }))

    fs.appendFileSync('dayImprovementsByPerson.json', JSON.stringify(dayImprovementsByPerson))
  } catch (error) {
    console.log(error)
  }
}

main()
