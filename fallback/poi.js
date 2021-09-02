import { MTRequest, urls } from './base3.js'

export default class Poi {
  constructor(appPoiCode, cookie) {
    this.appPoiCode = appPoiCode
    this.instance3 = new MTRequest(cookie)
  }

  list_() {
    const params = {
      isOpen: 0,
      pageNum: 1,
      pageSize: 500,
      ignoreSetRouterProxy: true
    }
    return this.instance3.get(urls.poi.list, { params })
  }

  async list() {
    try {
      const list_Res = await this.list_()
      if(!list_Res || !list_Res.dataList) return Promise.reject({err: 'poi list failed'})
      return Promise.resolve(list_Res.dataList)
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
