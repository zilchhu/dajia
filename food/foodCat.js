import instance, { urls } from '../base/index.js'

export default class FoodCat {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async list() {
    let params = {
      app_poi_code: this.appPoiCode
    }
    return instance.get(urls.foodCat.list, { params })
  }

  async update(categoryNameOrigin, categoryName, sequence) {
    let data = {
      app_poi_code: this.appPoiCode,
      category_name_origin: categoryNameOrigin,
      category_name: categoryName,
      sequence
    }
    return instance.post(urls.foodCat.update, data)
  }

  async delete(categoryName) {
    let data = {
      app_poi_code: this.appPoiCode,
      category_name: categoryName
    }
    return instance.post(urls.foodCat.delete, data)
  }
}

