import axios from 'axios'
import md5 from 'md5'
import dayjs from 'dayjs'
import qs from 'qs'
import omit from 'omit'

import urls_ from './url.js'

const testBaseUrl = 'https://test.com/'
const baseURL = 'https://waimaiopen.meituan.com/api/v1/'
const appId = 5339
const secret = '8fb39ea54dbcb28b9795004bd3fb3eb5'

const instance = axios.create({
  baseURL,
  responseType: 'json'
})

instance.interceptors.request.use(
  config => {
    if (config.method == 'get') {
      config.params.app_id = appId
      config.params.timestamp = dayjs().unix()
      config.params = sortParams(config.params)
      config.params.sig = sig(config.url, config.params)
    } else if (config.method == 'post') {
      config.data.app_id = appId
      config.data.timestamp = dayjs().unix()
      config.data = sortParams(config.data)
      config.data.sig = sig(config.url, config.data)
      config.data = qs.stringify(config.data)
    }
    console.log(config)
    return config
  },
  err => Promise.reject(err)
)

instance.interceptors.response.use(
  res => {
    if (res.data.error) {
      return Promise.reject(res.data.error)
    } else {
      return res.data.data
    }
  },
  err => Promise.reject(err)
)

function sig(url, p) {
  const param = qs.stringify(omit(['img_data'], p), {
    sort: alphabeticalSort,
    addQueryPrefix: true,
    encode: false
  })
  const fullUrl = `${baseURL}${url}${param}${secret}`
  console.log(fullUrl)
  const sig = md5(fullUrl)
  return sig
}

function sortParams(params) {
  return Object.keys(params)
    .sort()
    .reduce((res, key) => {
      res[key] = params[key]
      return res
    }, {})
}

function alphabeticalSort(a, b) {
  return a.localeCompare(b)
}

export function time(time) {
  return dayjs.unix(time).format('YYYY/M/D HH:mm:ss')
}

export default instance
export const urls = urls_

export async function prepMeal(poiCode, orderId) {
  try {
    let res = await instance.get(urls_.order.preparationMealComplete, { params: { order_id: orderId } })
    console.log(poiCode, orderId, res)
  } catch (e) {
    console.error(e)
  }
}

let a = `https://waimaiopen.meituan.com/api/v1/foodCat/update?app_id=5339&app_poi_code=t_fLkr2jOW5A&category_name=晚餐套餐&category_name_origin=&sequence=&timestamp=16068090158fb39ea54dbcb28b9795004bd3fb3eb5`

let aa = {
  app_id: appId,
  timestamp: dayjs().unix(),
  app_poi_code: 't_fLkr2jOW5A',
  category_name: '晚餐套餐1',
  category_name_origin: null,
  sequence: null
}

// console.log(sig(''))

// instance.post('foodCat/update', aa)
// .then(res=>console.log(res))
// .catch(err=>console.error(err))
