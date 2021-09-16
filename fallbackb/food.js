import reaxios from './reaxios.js'
import querystring from 'querystring'

export default class Food {
  constructor(wmPoiId, cookie) {
    this.wmPoiId = wmPoiId
    this.headers = {
      Accept: 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN',
      Connection: 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookie,
      Host: 'e.waimai.meituan.com',
      Origin: 'https://e.waimai.meituan.com',
      Referer: 'https://e.waimai.meituan.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Electron/13.1.1 Safari/537.36'
    }
  }

  async search(query) {
    const { data } = await reaxios({
      method: 'post',
      url: 'https://e.waimai.meituan.com/reuse/sc/product/retail/r/searchListPage',
      data: querystring.stringify(query)
    })
    if (data.code != 0) return Promise.reject(data.msg)
    return data.data
  }

  async searchByName(name) {
    let form = {
      wmPoiId: this.wmPoiId,
      pageNum: 1,
      pageSize: 20,
      needTag: 0,
      name,
      brandId: 0,
      tagId: null,
      searchWord: null,
      state: 0,
      saleStatus: 0,
      limitSale: 0,
      needCombinationSpu: 2,
      noStockAutoClear: -1
    }
  }
}