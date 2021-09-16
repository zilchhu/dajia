import axios from "axios"

const reaxios = axios.create({ timeout: 6000 }), namespace = 'reaxios'
let cache = {}

reaxios.interceptors.request.use(
  config => {
    config[namespace] = config[namespace] ?? {}
    config[namespace].retryCount = config[namespace].retryCount ?? 0

    const { cacheId, flushCache } = config[namespace]
    
    if (cacheId && !flushCache) {
      if (cache[cacheId]) {
        config.cancelSource?.cancel(cache[cacheId])
      }
    }

    if (Object.keys(cache) > 1000) {
      cache = {}
    }

    return config
  },
  err => Promise.reject(err)
)

reaxios.interceptors.response.use(
  res => {
    const config = res.config
    if (config && config[namespace].cacheId) {
      cache[config[namespace].cacheId] = res
    }

    return res
  },
  error => {
    const config = error.message?.config ?? error.config

    if (axios.isCancel(error) && config && config[namespace].cacheId) {
      console.log('hit cache')
      return Promise.resolve(error.message)
    }

    if (!config || !config[namespace]) {
      return Promise.reject(error)
    }

    // console.log(error)
    const shouldRetry =
      (/ETIMEDOUT|ECONNRESET|ECONNABORTED/.test(error.code)) &&
      config[namespace].retryCount < 10

    if (shouldRetry) {
      config[namespace].retryCount += 1
      console.log('retry...', config[namespace].retryCount)
      return new Promise(resolve =>
        setTimeout(() => resolve(reaxios({ ...config })), 300)
      )
    }

    return Promise.reject(error)
  }
)

export default reaxios