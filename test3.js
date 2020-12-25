import knex from 'knex'
import bcrypt from 'bcrypt'

const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai'
  }
})

async function login(username, password) {
  try {
    if (isEmptyStr(username) || isEmptyStr(password)) {
      return Promise.reject('blank')
    }
    const hashedPass = await knx('test_analyse_user_')
      .select()
      .where({ username })
    if (hashedPass.length > 0) {
    } else {
      const hashed_password = await bcrypt.hashSync(password, 8)
      const res = await knx('test_analyse_user_').insert({
        username,
        hashed_password
      })
      return Promise.resolve(res)
    }
  } catch (err) {
    console.log(err)
  }
}

function isEmptyStr(str) {
  if (str === null || str === undefined || str == '' || /\W+/.test(str)) return true
  else return false
}

;(async () => {
  try {
    const res = await login('test1', '1')
    console.log(res)
  } catch (error) {
    console.error(error)
  }
})()
