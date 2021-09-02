import instance, { urls } from '../base/index.js'

export default class Food {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
    this.property = new Property(this.appPoiCode)
    this.sku = new Sku(appPoiCode)
  }

  async list(offset, limit) {
    if (!this.appPoiCode) throw Error('appPoiCode is Null')
    if (limit && limit > 200) throw Error('limit > 200')
    let params = {
      app_poi_code: this.appPoiCode,
      limit,
      offset
    }
    return instance.get(urls.food.list, { params })
  }

  async get(appFoodCode) {
    let params = {
      app_poi_code: this.appPoiCode,
      app_food_code: appFoodCode
    }
    return instance.get(urls.food.get, { params })
  }

  async delete(appFoodCode) {
    let data = {
      app_poi_code: this.appPoiCode,
      app_food_code: appFoodCode
    }
    return instance.post(urls.food.delete, data)
  }

  async initdata(appFoodCode, _data) {
    let data = {
      app_poi_code: this.appPoiCode,
      app_food_code: appFoodCode,
      ..._data
    }
    return instance.post(urls.food.initdata, data)
  }

  async batchsave() {}
}

class Property {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async list(appFoodCode) {
    let params = {
      app_poi_code: this.appPoiCode,
      app_food_code: appFoodCode
    }
    return instance.get(urls.food.property.list, { params })
  }

  async bind(foodProperty) {
    let data = {
      app_poi_code: this.appPoiCode,
      food_property: foodProperty
    }
    return instance.post(urls.food.bind.property, data)
  }
}

class Sku {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async save(appFoodCode, skus) {
    let data = {
      app_poi_code: this.appPoiCode,
      app_food_code: appFoodCode,
      skus: JSON.stringify(skus)
    }
    return instance.post(urls.food.sku.save, data)
  }

  async delete(appFoodCode, skuId) {
    let data = {
      app_poi_code: this.appPoiCode,
      app_food_code: appFoodCode,
      sku_id: skuId
    }
    return instance.post(urls.food.sku.delete, data)
  }
}
