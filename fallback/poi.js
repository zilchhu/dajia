import instance, { urls } from './base.js'

export default class Poi {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  list() {
    const params = {
      isOpen: 0,
      pageNum: 1,
      pageSize: 300,
      ignoreSetRouterProxy: true
    }
    return instance.get(urls.poi.list, { params })
  }
}
