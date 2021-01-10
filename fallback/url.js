const urls = {
  act: {
    list: '/reuse/activity/setting/r/getAllFoodActPolicy',
    save: '/reuse/activity/setting/w/updateSpecialMealBase',
    delete: '/reuse/activity/setting/w/deleteWmActPolicySpecial',

    reduction: {
      list: '/reuse/activity/query/list',
      save: '/reuse/activity/setting/w/save',
      delete: '/reuse/activity/setting/w/delPoiAct'
    },

    tradein: {
      list: '/reuse/activity/query/list',
      save: '/reuse/activity/setting/w/save',
      delete: '/reuse/activity/setting/w/deleteWmActItemsByWmActItemIds'
    }
  },
  food: {
    search: '/reuse/product/food/r/searchByName',
    list: '/reuse/product/food/r/spuList',
    save: '/reuse/product/food/w/save',
    updatePrice: '/reuse/product/food/w/updatePrice',
    updateMinOrderCount: '/reuse/product/food/w/updateSpuMinOrderCount',
    batchUpdateSkus: '/reuse/product/food/w/batchUpdateSku',
    batchUpdateBoxPrice: '/reuse/product/food/w/batchUpdateSkuBoxPrice',
    updateImg: '/reuse/product/food/w/saveMultiImage',
    batchUpdateStock: 'reuse/product/food/w/batchUpdateSkuStock',
    updateName: 'reuse/product/food/w/updateSpuName',
    updateFoodCatSeq: 'reuse/product/food/w/changeTagSequence',
    updateFoodCatName: '/reuse/product/food/w/saveTagInfo',
    batchUpdateTag: 'reuse/product/food/w/batchUpdateTag',
    batchDelete: 'reuse/product/food/w/batchDelete',
    highBoxPrice: '/reuse/product/food/r/highBoxPriceProductCount',
    syncFood: '/reuse/product/sync_food/w/submit'
  },
  poi: {
    list: '/v2/shop/businessStatus/r/poiListSearch'
  },
  download: {
    food: {
      down: '/reuse/product/food/r/downloadProductByExcel',
      list: '/reuse/product/task/r/list'
    },
  }
}

export default urls