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

const dbTables = {
  user: 'test_analyse_user_',
  login: 'test_analyse_login_'
}

async function r_l(username, password) {
  try {
    if(isEmptyStr(username) || isEmptyStr(password)) {
      return Promise.reject('empty')
    }

    const user = await knx(dbTables.user).select().where({username})

    if(!user) {
      await rigister(username, password)
      return login(username, password)
    }

    return login(username, password)

  } catch (err) {
    return Promise.reject(err)
  }
}

async function rigister(username, password) {
  try {
    const hashed_password = await bcrypt.hash(password, 8)
    await knx(dbTables.user).insert({username, hashed_password})
  } catch (err) {
    return Promise.reject(err)
  }
}

async function login(username, password) {
  try {
    
  } catch (err) {
    return Promise.reject(err)
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
