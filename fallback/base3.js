import axios from 'axios'
import qs from 'qs'
import urls_ from './url.js'

function jsonify(obj) {
  return Object.entries(obj).reduce((p, [k, v]) => {
    return {
      ...p,
      [k]: v != null && typeof v == "object" ? JSON.stringify(v) : v,
    }
  }, {})
}

export class MTRequest {
  constructor(cookie) {
    this.cookie = cookie
    this.init()
  }

  init() {
    let axiosConfig = {
      baseURL: 'https://waimaieapp.meituan.com',
      timeout: 5000,
      responseType: 'json',
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        Connection: 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Cookie: this.cookie,
        Host: 'waimaie.meituan.com',
        Origin: 'https://waimaie.meituan.com',
        Referer: 'https://waimaie.meituan.com/v2/shop/manage/shopInfo?ignoreSetRouterProxy=true',
        'sec-ch-ua': '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }

    const namespace = 'axios-retry'

    this.instance = axios.create(axiosConfig)

    this.instance.interceptors.request.use(
      config => {
        config[namespace] = config[namespace] || {}
        config[namespace].data = config.data
        config[namespace].retryCount = config[namespace].retryCount || 0

        config.data = new URLSearchParams(jsonify(config.data)).toString()
        return config
      },
      err => Promise.reject(err)
    )

    this.instance.interceptors.response.use(
      res => {
        // console.log(res.data)
        if (res.data?.code === 0) {
          // console.log(0)
          return res.data?.data == '' || res.data?.data == null ? res.data : res.data?.data
        } else {
          // console.log(res)
          if (res.data?.msg == '请勿重复提交' || res.data?.msg?.startsWith('SPU名称重复')) {
            const config = res.config

            if (!config || !config[namespace]) {
              return Promise.reject(error)
            }

            const shouldRetry =
              config[namespace].retryCount < 8

            if (shouldRetry) {
              config[namespace].retryCount += 1

              console.log('res retry...', config[namespace].retryCount)
              return new Promise(resolve =>
                setTimeout(() => resolve(this.instance({ ...config, data: config[namespace].data })), 800)
              )
            }

            return Promise.reject(res.data)
          }

          return Promise.reject(res.data)
        }
      },

      error => {
        const config = error.config

        if (!config || !config[namespace]) {
          return Promise.reject(error)
        }

        const shouldRetry =
          (/ETIMEDOUT|ECONNRESET|ECONNABORTED|ENOTFOUND|EHOSTUNREACH/.test(error.code) || error.msg == '服务器超时，请稍后再试' || error.msg == '请勿重复提交') &&
          config[namespace].retryCount < 20

        if (shouldRetry) {
          config[namespace].retryCount += 1

          console.log('err retry...', config.url, config[namespace].retryCount)
          return new Promise(resolve =>
            setTimeout(() => resolve(this.instance({ ...config, data: config[namespace].data })), 600)
          )
        }

        return Promise.reject(error)
      }
    )
  }
}

export const urls = urls_
