import { MTRequest, urls } from './base3.js'

export default class Poi {
  constructor(wmPoiId, cookie) {
    this.wmPoiId = wmPoiId
    this.instance3 = new MTRequest(cookie).instance
  }

  _list() {
    const params = {
      isOpen: 0,
      pageNum: 1,
      pageSize: 500,
      ignoreSetRouterProxy: true
    }
    return this.instance3.get(urls.poi.list, { params })
  }

  list2() {
    const data = {
      optimus_uuid: 'aa43a266-07a2-41a3-99b5-f79ab32a453b',
      optimus_risk_level: 71,
      optimus_code: 10,
      optimus_partner: 19
    }
    return this.instance3.post(urls.poi.list2, data)
  }

  async list() {
    const { dataList } = await this._list()
    return dataList
  }

  async find() {
    const list = await this.list2()
    const poi = list.find(v => v.id == this.wmPoiId)
    if (poi) return poi
    return Promise.reject({ tag: 'poi.find', message: `poi:${this.wmPoiId} not found` })
  }
}
