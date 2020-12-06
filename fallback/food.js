import instance, { urls } from './base.js'

export default class Food {
  constructor(wmPoiId) {
    this.wmPoiId = wmPoiId
  }

  async search_(name) {
    let params = {
      wmPoiId: this.wmPoiId,
      name,
      pageNum: 1,
      pageSize: 30,
      needTagList: 0
    }
    return instance.get(urls.food.search, { params })
  }

  async search(name, retry = 0) {
    try {
      
    } catch (error) {
     
    }
  }
}
