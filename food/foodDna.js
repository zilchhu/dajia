import instance, {urls} from '../base/index.js'

export default class FoodDna {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async getCategory() {
    let data = {
      app_poi_code: this.appPoiCode
    }
    return instance.post(urls.foodDna.getCategory, data)
  }

  async getTemplateBySpuId(appFoodCode) {
    let data = {
      app_poi_code: this.appPoiCode,
      app_food_code: appFoodCode
    }
    return instance.post(urls.foodDna.getTemplateBySpuId, data)
  }

  async getPropertiesByCategoryId(categoryId) {
    let data = {
      app_poi_code: this.appPoiCode,
      category_id: categoryId
    }
    return instance.post(urls.foodDna.getPropertiesByCategoryId, data)
  }

}