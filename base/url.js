const urls = {
  food: {
    initdata: 'food/initdata',
    save: 'food/save',
    delete: 'food/delete',
    updateAppFoodCodeByOrigin: 'food/updateAppFoodCodeByOrigin',
    updateAppFoodCodeByNameAndSpec: 'food/updateAppFoodCodeByNameAndSpec',

    batchinitdata: 'food/batchinitdata',
    batchsave: 'food/batchsave',
    batchbulksave: 'food/batchbulksave',

    get: 'food/get',
    list: 'food/list',

    sku: {
      save: 'food/sku/save',
      delete: 'food/sku/delete',
      price: 'food/sku/price',
      stock: 'food/sku/stock',
      inc_stock: 'food/sku/inc_stock',
      desc_stock: 'food/sku/desc_stock',
      sellStatus: 'food/sku/sellStatus'
    },

    bind: {
      property: 'food/bind/property'
    },

    property: {
      list: 'food/property/list'
    }
  },
  foodCat: {
    update: 'foodCat/update',
    delete: 'foodCat/delete',

    list: 'foodCat/list'
  },
  foodDna: {
    saveFoodDna: 'foodDna/saveFoodDna',

    getCategory: 'foodDna/getCategory',
    getTemplateBySpuId: 'foodDna/getTemplateBySpuId',
    getPropertiesByCategoryId: 'foodDna/getPropertiesByCategoryId'
  },
  image: {
    upload: 'image/upload',
    uploadNoWater: 'image/uploadNoWater'
  },
  comment: {
    add_reply: 'poi/comment/add_reply',

    query: 'comment/query',
    score: 'comment/score'
  },
  shipping: {
    save: 'shipping/save',
    delete: 'shipping/delete',
    resetSelfDeliveryArea: 'shipping/resetSelfDeliveryArea',

    batchsave: 'shipping/batchsave',

    fetch: 'shipping/fetch',
    list: 'shipping/list',

    spec: {
      save: 'shipping/spec/save'
    }
  },
  poi: {
    save: 'poi/save',
    open: 'poi/open',
    close: 'poi/close',
    online: 'poi/online',
    offline: 'poi/offline',
    updatepromoteinfo: 'poi/updatepromoteinfo',

    getids: 'poi/getids',
    mget: 'poi/mget',


    poiTag: {
      list: 'poiTag/list'
    },

    shippingtime: {
      update: 'shippingtime/update'
    },

    bill: {
      list: 'wm/bill/list'
    },

    logistics: {
      isDelayPush: 'poi/logistics/isDelayPush',
      setDelayPush: 'poi/logistics/setDelayPush'
    },

    weight: {
      canOpen: 'poi/weight/canOpen',
      open: 'poi/weight/open'
    },

    card: {
      saveCard: 'poi/card/saveCard',
      queryCard: 'poi/card/queryCard'
    }
  },
  act: {
    discount: {
      activity_order_limit: 'act/discount/activity_order_limit',

      delete: 'act/discount/delete',
      batchsave: 'act/discount/batchsave',
      stock: 'act/discount/stock',

      list: 'act/discount/list'
    }
  },
  decoration: {
    postersCreate: 'decoration/postersCreate',
    deleteShopPoster: 'decoration/deleteShopPoster',
    updatePosterStatus: 'decoration/updatePosterStatus',
    queryPoster: 'decoration/queryPoster',

    signageCreate: 'decoration/signageCreate',
    deleteImageForSingle: 'decoration/deleteImageForSingle',
    queryImageForSingle: 'decoration/queryImageForSingle',

    bossRecommendCreate: 'decoration/bossRecommendCreate',
    bossRecommendQuery: 'decoration/bossRecommendQuery',
    productsQuery: 'decoration/productsQuery'
  },
  IM: {
    setPoiIMStatus: 'wm/IM/setPoiIMStatus',
    getPoiIMStatus: 'wm/IM/getPoiIMStatus',

    batchSetPoiIMStatus: 'wm/IM/batchSetPoiIMStatus',
    batchGetPoiIMStatus: 'wm/IM/batchGetPoiIMStatus',

    getConnectionToken: 'wm/IM/getConnectionToken',

    msgRead: 'wm/IM/msgRead',
    userReadTime: 'wm/IM/userReadTime'
  },
  order: {
    poi_received: 'order/poi_received',
    confirm: 'order/confirm',
    cancel: 'order/cancel',
    delivering: 'order/delivering',
    arrived: 'order/arrived',
    
    viewstatus: 'order/viewstatus',
    getOrderDetail: 'order/getOrderDetail',
    getActDeatilByAcId: 'order/getActDetailByAcId',

    batchFetchAbnormalOrder: 'order/batchFetchAbnormalOrder',

    getOrderDaySeq: 'order/getOrderDaySeq',
    getOrderIdByDaySeq: 'order/getOrderIdByDaySeq',

    applyPartRefund: 'order/applyPartRefund',
    getPartRefundFoods: 'order/getPartRefundFoods',

    remindReply: 'order/remindReply',

    preparationMealComplete: 'order/preparationMealComplete',
    getPreparationMealTime: 'order/getPreparationMealTime',

    batchPullPhoneNumber: 'order/batchPullPhoneNumber',

    applyCompensation: 'order/applyCompensation',
    getSupportedCompensation: 'order/getSupportedCompensation',
    getCompensationResult: 'order/getCompensationResult',
    batchCompensationOrder: 'order/batchCompensationOrder',

    riderPosition: 'order/riderPosition',
    getRiderInfoPhoneNumber: 'order/getRiderInfoPhoneNumber',

    cancelLogisticsByWmOrder: 'order/cancelLogisticsByWmOrder',
    getCancelDeliveryReason: 'order/getCancelDeliveryReason',

    refund: {
      agree: 'order/refund/agree',
      reject: 'order/refund/reject'
    },

    logistics: {
      push: 'order/logistics/push',
      cancel: 'order/logistics/cancel',
      status: 'order/logistics/status',

      change: {
        poi_self: 'order/logistics/change/poi_self'
      }
    },

    thirdLogistics: {
      prePushThirdLogistics: 'order/thirdLogistics/prePushThirdLogistics',
      pushThirdLogistics: 'order/thirdLogistics/pushThirdLogistics',
      addTipAmount: 'order/thirdLogistics/addTipAmount',
      cancelThirdLogistics: 'order/thirdLogistics/cancelThirdLogistics',

      getDistributorList: 'order/thirdLogistics/getDistributorList',
      getThirdLogisticsPushList: 'order/thirdLogistics/getThirdLogisticsPushList',
      getCancelReasonList: 'order/thirdLogistics/getCancelReasonList',
    },

    zhongbao: {
      dispatch: 'order/zhongbao/dispatch',
      shippingFee: 'order/zhongbao/shippingFee',

      update: {
        tip: 'order/zhongbao/update/tip'
      }
    }

  }
}

export default urls