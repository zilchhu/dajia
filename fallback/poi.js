import instance, { urls } from './base.js'

export default class Poi {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  list_() {
    const params = {
      isOpen: 0,
      pageNum: 1,
      pageSize: 300,
      ignoreSetRouterProxy: true
    }
    return instance.get(urls.poi.list, { params })
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
