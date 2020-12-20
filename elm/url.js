const urls = {
  food: {
    search: 'nevermore.goods/invoke/?method=FoodService.getItemForSearch',
    updateAttr: 'nevermore.goods/invoke/?method=FoodService.updateGoodsAttr',
    updateStock: 'nevermore.goods/invoke/?method=FoodService.updateFoodsStock',
    batchRemove: 'nevermore.goods/invoke/?method=FoodService.batchRemoveFoods'
  },
  act: {
    invalid: 'marketing/invoke/?method=ActivityNcpService.invalidActivity',
    create: 'marketing/invoke/?method=SkuActivityNcpService.createAndParticipatePriceActivity'
  },
  shop: {
    list: 'shop/invoke/?method=shop.getRestaurantTree'
  }
}

export default urls