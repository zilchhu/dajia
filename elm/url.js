const urls = {
  food: {
    search: 'nevermore.goods/invoke/?method=FoodService.getItemForSearch',
    updateAttr: 'nevermore.goods/invoke/?method=FoodService.updateGoodsAttr',
    updateStock: 'nevermore.goods/invoke/?method=FoodService.updateFoodsStock',
    batchRemove: 'nevermore.goods/invoke/?method=FoodService.batchRemoveFoods',
    updateFoodCatSeq: 'nevermore.goods/invoke/?method=FoodService.setGroupPosition',
    listFoodCat: 'nevermore.goods/invoke/?method=FoodService.queryCategoryWithFoodFilter'
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