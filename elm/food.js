import instance, { urls } from './base.js'

class Food {
  constructor(shopId) {
    this.shopId = shopId
    this.headers = { 'x-shard': `shopid=${shopId}` }
  }

  updateFoodCatSeq(categoryOrders) {
    let data = {
      service: 'FoodService',
      method: 'setGroupPosition',
      params: {
        shopId: this.shopId,
        categoryOrders
      }
    }
    return instance.post(urls.food.updateFoodCatSeq, data, { headers: this.headers })
  }

  listFoodCat() {
    let data = {
      service: 'FoodService',
      method: 'queryCategoryWithFoodFilter',
      params: {
        shopId: this.shopId,
        foodFilter: 0,
        XHR_TIMEOUT: 30000
      }
    }
    return instance.post(urls.food.listFoodCat, data, { headers: this.headers })
  }
}
