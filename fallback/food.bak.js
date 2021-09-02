class Food {
  constructor() { }
  
  async save5(name, catName, updates) {
    const basicInfo = (food, foodEdit) => {
      const { wmProductSpu } = foodEdit
      return {
        id: wmProductSpu.id, // ✔
        wm_poi_id: wmProductSpu.wm_poi_id,
        tag_id: wmProductSpu.tag_id,
        tag_name: wmProductSpu.tag_name,
        name: wmProductSpu.name,
        wmProductPics: wmProductSpu.wmProductPics,
        specialEffectPic: wmProductSpu.specialEffectPic,
        description: wmProductSpu.description,
      }
    }

    const detailInfo = async (food, foodEdit) => {
      const template = await this.getTemplate(food.id, 1)

      return {
        category_id: template.categoryId,
        properties_values: template.properties_values, // ✔
      }
    }

    const sellInfo = (food, foodEdit) => {
      const { wmProductSpu } = foodEdit
      return {
        newSpuAttrs: wmProductSpu.newSpuAttrs,
        stockAndBoxPriceSkus: wmProductSpu.wmProductSkus.map(sku => ({
          price: sku.price,
          unit: sku.unit || '1人份',
          box_price: sku.box_price,
          spec: sku.spec || `（${sku.unit || '1人份'}）`,
          weight: sku.weight,
          wmProductLadderBoxPrice: {
            status: 1,
            ladder_num: sku.box_num,
            ladder_price: sku.box_price
          },
          wmProductStock: {
            id: '0',
            stock: -1,
            max_stock: -1,
            auto_refresh: 1
          },
          attrList: sku.attrList.find(a => a.name == '份量')?.value
            ? sku.attrList
            : [{
              name: '份量',
              name_id: 0,
              value: `${sku.unit || '1人份'}__默认`,
              value_id: 0,
              no: 0
            }]
        })),
        unifiedPackagingFee: 2,
        wmProductLadderBoxPrice: wmProductSpu.wmProductLadderBoxPrice,
        wmProductStock: wmProductSpu.wmProductStock || {
          id: '0',
          stock: -1,
          max_stock: -1,
          auto_refresh: 1
        },
      }
    }

    const advanceInfo = (food, foodEdit) => {
      const { wmProductSpu } = foodEdit
      return {
        isShippingTimeSyncPoi: wmProductSpu.isShippingTimeSyncPoi || 2,
        shipping_time_x: wmProductSpu.shipping_time_x,
        min_order_count: wmProductSpu.min_order_count,
        labelList: wmProductSpu.labelList ?? [],
        singleOrderNoDelivery: wmProductSpu.singleOrderNoDelivery,
        wmProductVideo: null,
        productCardDisplayContent: wmProductSpu.productCardDisplayContent || '',
        labelValues: wmProductSpu.labelValues || [],
      }
    }

    const food = await this.find(name, catName)
    const foodEdit = await this.getEditView2(food.id)

    // console.log(foodEdit)

    let basic = basicInfo(food, foodEdit)
    let detail = await detailInfo(food, foodEdit)
    let sell = sellInfo(food, foodEdit)
    let advance = advanceInfo(food, foodEdit)

    let model = {
      ...basic,
      ...detail,
      ...sell,
      ...advance,
      ...updates
    }

    const { ok } = await this.setHighBoxPrice2(
      Math.max(...food.wmProductSkus.map(sku => sku.boxPrice)), food.wmProductSkus.length
    )

    if (ok) {
      return this.save_(model)
    } else {
      return Promise.reject('sync failed')
    }
  }
}