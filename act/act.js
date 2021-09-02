import instance, { urls } from '../base/index.js'

export default class Act {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async list(offset = 0, limit = 200) {
    let params = {
      app_poi_code: this.appPoiCode,
      offset,
      limit
    }
    return instance.get(urls.act.discount.list, { params })
  }

  async delete(appFoodCodes) {
    let data = {
      app_poi_code: this.appPoiCode,
      app_food_codes: appFoodCodes
    }
    return instance.post(urls.act.discount.delete, data)
  }

  async batchsave(actData) {
    let data = {
      app_poi_code: this.appPoiCode,
      act_data: JSON.stringify(actData)
    }
    return instance.post(urls.act.discount.batchsave, data)
  }
}
