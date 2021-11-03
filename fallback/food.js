// import instance, { urls } from './base.js'
import { MTRequest, urls } from './base3.js'
import instance2 from './base2.js'
import sleep from 'sleep-promise'
import dayjs from 'dayjs'
import download from 'download'
import xls2Json from 'xls-to-json'
import util from 'util'
import htmlparser2 from 'htmlparser2'
import fs from 'fs'
import flatten from 'flatten'
import pLimit from 'p-limit'
import { isSameArrayBy, combineArray, keepBy } from '../utils/util.js'

const axls2Json = util.promisify(xls2Json)

function omit(obj, ks) {
  let newKs = Object.keys(obj).filter(v => !ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

function keep(obj, ks) {
  let newKs = Object.keys(obj).filter(v => ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

export default class Food {
  constructor(wmPoiId, cookie) {
    this.wmPoiId = wmPoiId
    this.instance3 = new MTRequest(cookie).instance
    this.csrfToken =
      'C2iobKssxvX9gcPZkIbkXDPP5Mls9/1Y7xe4KetV2Iw9Z7np//UnX+hQJO5D4tnEotlScBQEVGWqJ1nKFWbIeAmD6TrLkFGVtjOy2ufHno+WF9T0BAJhAlUs5WXTUF71+Syw8PmPhWqSdtV7ppIqEw=='
  }

  async search_(name, pageNum = 1) {
    let params = {
      wmPoiId: this.wmPoiId,
      name,
      pageNum,
      pageSize: 30,
      needTagList: 0
    }
    return this.instance3.get(urls.food.search, { params })
  }

  async search(name, retry = 0) {
    if (retry > 2) return
    try {
      const res = await this.search_(name)
      return res
    } catch (error) {
      console.error(error)
      this.search(name, retry + 1)
    }
  }

  async searchFood(name) {
    try {
      const res = await this.search_(name)
      const limit = pLimit(3)
      const pageNums = Array.from(new Array(Math.ceil(res.totalCount / 30)).keys()).map(v => v + 1)
      const pages = await Promise.all(pageNums.map(n => limit(() => this.search_(name, n))))
      return Promise.resolve(pages.flatMap(v => v.productList))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async find(name, catName) {
    try {
      const searchRes = await this.search_(name)
      if (!searchRes || !searchRes.productList) return Promise.reject({ err: 'find failed' })
      const product = searchRes.productList.find(v => v.name == name && v.tagName == catName)
      if (!product) return Promise.reject({ '[搜索商品]': '商品不存在' })
      return Promise.resolve(product)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async mfind(name) {
    try {
      const searchRes = await this.search_(name)
      if (!searchRes || !searchRes.productList) return Promise.reject({ err: 'find failed' })
      const products = searchRes.productList.filter(v => v.name == name)
      if (!products) return Promise.reject({ err: 'not find' })
      return Promise.resolve(products)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async download_() {
    const params = {
      wmPoiId: this.wmPoiId,
      v2: 1
    }
    return this.instance3.get(urls.download.food.down, { params })
  }

  async listDowns_() {
    const params = {
      wmPoiId: this.wmPoiId,
      pageSize: 10,
      pageNum: 1,
      type: 6
    }
    return this.instance3.get(urls.download.food.list, { params })
  }

  async list() {
    try {
      await this.download_()
      await sleep(3000)
      const excels = await this.listDowns_()
      const excel = excels.data.find(
        v => dayjs.unix(v.utime).month() == dayjs().month() && dayjs.unix(v.utime).date() == dayjs().date()
      )
      if (excel) {
        await download(excel.output, 'data')
        const filename = new URL(excel.output).pathname.split('/')[2]
        const res = await axls2Json({
          input: `data/${filename}`,
          output: `data/${filename}.json`
        })
        return res
      }
    } catch (error) {
      console.error(error)
    }
  }

  async list2_(config = {}) {
    let params = {
      wmPoiId: this.wmPoiId,
      opType: 0,
      queryCount: 0,
      pageNum: 1,
      pageSize: 1,
      needAllCount: true,
      needTagList: true,
      ...config
    }
    return this.instance3.get(urls.food.list, { params })
  }

  async listTags() {
    const list2_Res = await this.list2_()
    return list2_Res.tagList
  }

  async listFoods(tagId) {
    const list2_Res = await this.list2_({ tagId, pageSize: 500 })
    return list2_Res.productList
  }

  async listLqs() {
    let params = {
      queryCount: 0,
      pageNum: 1,
      pageSize: 100,
      wmPoiId: this.wmPoiId
    }
    return this.instance3.get(urls.food.listLqs, { params })
  }

  async searchTag(name) {
    const tags = await this.listTags()
    const tag = tags.find(v => v.name.includes(name))
    if (!tag) return Promise.reject({ err: 'tag1 not find' })
    return Promise.resolve(tag)
  }

  async findTag(name) {
    const tags = await this.listTags()
    const tag = tags.find(v => v.name == name)
    if (!tag) return Promise.reject({ err: 'tag not find' })
    return Promise.resolve(tag)
  }

  async findTag2({ id, name }) {
    const tags = await this.listTags()
    const tag = tags.find(v => v.id == id || v.name == name)
    if (tag == null) return Promise.reject({ message: `tag:${id}/${name} not found` })
    return tag
  }

  async findInTag(name, catName) {
    const tag = await this.findTag(catName)
    const foods = await this.listFoods(tag.id)
    const food = foods.find(v => v.name == name)
    if (!food) return Promise.reject({ '[搜索商品]': '商品不存在' })
    return food
  }

  async findFood({ spuId, spuName, tagId, tagName }) {
    if (spuName != null) {
      const spus = await this.searchFood(spuName)
      const spu = await spus.find(v => v.name == spuName && (v.tagId == tagId || v.tagName == tagName))
      if (spu == null) return Promise.reject({ message: `spu:${spuId}/${spuName} not found` })
      return spu
    }
    if (spuId != null) {
      const tag = await this.findTag2({ id: tagId, name: tagName })
      const spus = await this.listFoods(tag.id)
      const spu = spus.find(v => v.id == spuId)
      if (spu == null) return Promise.reject({ message: `spu:${spuId}/${spuName} not found` })
      return spu
    }
    return Promise.reject({ message: 'spu not found' })
  }

  async delTag(tagId) {
    let data = {
      tagId,
      wmPoiId: this.wmPoiId
    }
    return this.instance3.post(urls.food.delTag, data)
  }

  async updatePrice(skuId, price) {
    let data = {
      wmPoiId: this.wmPoiId,
      skuId,
      price
    }
    return this.instance3.post(urls.food.updatePrice, data)
  }

  async batchUpdateSkus_(spuIds, skuIds, skusInfo) {
    let data = {
      wmPoiId: this.wmPoiId,
      spuIds: spuIds.join(','),
      skuIds: skuIds.join(','),
      skusInfo: JSON.stringify(skusInfo),
      unifiedPackagingFee: 2,
    }
    return this.instance3.post(urls.food.batchUpdateSkus, data)
  }

  async batchUpdateSkus(spuIds, skuIds, skus) {
    try {
      let skusInfo = skus.map((sku, i) => ({
        ...skuT,
        spec: `${i}`,
        ...sku
      }))
      const batchUpdateSkusRes = await this.batchUpdateSkus_(spuIds, skuIds, skusInfo)
      return Promise.resolve(batchUpdateSkusRes)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async batchUpdateBoxPrice(skuIds, boxPrice) {
    let data = {
      wmPoiId: this.wmPoiId,
      boxPrice,
      skuIds: skuIds.join(','),
      ladderStatus: 1,
      laderNum: 1,
      v2: 1,
      opTab: 1,
      viewStyle: 0
    }
    return this.instance3.post(urls.food.batchUpdateBoxPrice, data)
  }

  async batchUpdateSaleAttr(spuIds, newAttrs, box, stock) {
    let data = {
      wmPoiId: this.wmPoiId,
      spuIds,
      newSpuAttrsInfo: JSON.stringify(newAttrs), // [{"name":"温度","name_id":0,"value":"冷","value_id":0,"price":0,"no":2,"mode":1,"value_sequence":0,"weight":0,"weightUnit":null,"sell_status":0}]
      unifiedPackagingFee: 1,
      wmProductLadderBoxPrice: JSON.stringify(box), // { "status": 1, "ladder_num": 1, "ladder_price": 0 },
      wmProductStock: JSON.stringify(stock), // { "id": 0, "stock": 10000, "max_stock": 10000, "auto_refresh": 1 },
    }
    return this.instance3.post(urls.food.batchUpdateSaleAttr, data)
  }

  async batchUpdateMinOrderCount(spuIds, minOrderCount) {
    let data = {
      wmPoiId: this.wmPoiId,
      minOrderCount,
      spuIds
    }
    return this.instance3.post(urls.food.batchUpdateMinOrder, data)
  }

  async createTestFood(tagId, tagName, foodName) {
    let data = {
      wmPoiId: this.wmPoiId,
      wmFoodVoJson: JSON.stringify(
        foodT.map(t => ({
          ...t,
          wm_poi_id: this.wmPoiId,
          tag_id: tagId,
          tag_name: tagName,
          name: foodName
        }))
      )
    }
    return this.instance3.post(urls.food.save, data)
  }

  async createTestFoods(spuListJson) {
    let data = {
      wmPoiId: this.wmPoiId,
      spuListJson: JSON.stringify(
        spuListJson
        // [{ "id": 0, "wm_poi_id": "9947800", "isShippingTimeSyncPoi": 2, "shipping_time_x": "-", "name": "测试4", "description": "", "min_order_count": "10", "unit": "份", "tag_name": "店铺公告2", "status": 0, "labelIds": "", "picture": "", "wmProductSkus": [{ "id": 0, "price": "88", "box_num": "1", "box_price": "0", "wm_food_spu_id": "", "spec": "", "valid": 1, "stock": -1 }] }]
      ),
      tagInfo: null
    }
    return this.instance3.post(urls.food.batchSave, data)
  }

  async uploadImg(multipart) {
    let data = {
      multipart,
      needPicPropaganda: 1
    }
    return this.instance3.post(urls.food.uploadImg, data)
  }

  async updateImg(spuId, newUrl) {
    let data = {
      wmPoiId: this.wmPoiId,
      newUrl,
      spuId,
      type: 2,
      sequence: 1,
      qualityScore: 1,
      v2: 1,
      viewStyle: 0,
      opTab: 0,
      tagCat: 1
    }
    return this.instance3.post(urls.food.updateImg, data)
  }

  async batchUpdateStock(skuIds, stock = -1) {
    let data = {
      wmPoiId: this.wmPoiId,
      skuIds: skuIds.join(','),
      stock,
      // maxStock: 10000,
      autoRefresh: 1,
      v2: 1,
      viewStyle: 0,
      opTab: 0,
      tagCat: 1
    }
    return this.instance3.post(urls.food.batchUpdateStock, data)
  }

  async updateName(spuId, spuName) {
    let data = {
      v2: 1,
      opTab: 0,
      viewStyle: 0,
      tagCat: 1,
      wmPoiId: this.wmPoiId,
      spuName,
      spuId
    }
    return this.instance3.post(urls.food.updateName, data)
  }

  async updateFoodCatSeq(tagId, targetSeq) {
    let data = {
      wmPoiId: this.wmPoiId,
      tagId,
      targetSeq
    }
    return this.instance3.post(urls.food.updateFoodCatSeq, data)
  }

  async updateFoodCatName_(tag, tagName) {
    let data = {
      wmPoiId: this.wmPoiId,
      tagInfo: JSON.stringify({
        id: tag.id,
        name: tagName,
        description: tag.description,
        top_flag: tag.topFlag,
        tag_type: tag.tagType,
        time_zone: tag.timeZone,
        sequence: tag.sequence
      })
    }
    return this.instance3.post(urls.food.updateFoodCatName, data)
  }

  async updateFoodCatTop_(tag) {
    let data = {
      wmPoiId: this.wmPoiId,
      tagInfo: JSON.stringify({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        top_flag: 1,
        tag_type: tag.tagType,
        time_zone: {
          '4': [{ start: '00:00', end: '23:59', time: '00:00-23:59' }],
          '5': [{ start: '00:00', end: '23:59', time: '00:00-23:59' }]
        },
        sequence: tag.sequence
      })
    }
    return this.instance3.post(urls.food.updateFoodCatName, data)
  }

  async updateFoodCatUnTop_(tag) {
    let data = {
      wmPoiId: this.wmPoiId,
      tagInfo: JSON.stringify({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        top_flag: 0,
        tag_type: tag.tagType,
        time_zone: {},
        sequence: tag.sequence
      })
    }
    return this.instance3.post(urls.food.updateFoodCatName, data)
  }

  async saveFoodCat(tagName, seq) {
    let data = {
      wmPoiId: this.wmPoiId,
      tagInfo: JSON.stringify({
        id: '',
        name: tagName,
        description: '',
        top_flag: 0,
        tag_type: 0,
        time_zone: {},
        sequence: seq
      })
    }
    return this.instance3.post(urls.food.updateFoodCatName, data)
  }

  async updateFoodCatName(tagName, newTagName) {
    try {
      const tag = await this.searchTag(tagName)
      const tagUpdatedRes = await this.updateFoodCatName(tag, newTagName)
      return Promise.resolve(tagUpdatedRes)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async updateFoodCatTime(tagName, newTagName) {
    try {
      const tag = await this.searchTag(tagName)
      const tagUpdatedRes = await this.updateFoodCatName(tag, newTagName)
      return Promise.resolve(tagUpdatedRes)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  // async updateFoodCatTop(tagName) {
  //   try {
  //     const tag = await this.searchTag(tagName)
  //     const tagUpdatedRes = await this.updateTa(tag, newTagName)
  //     return Promise.resolve(tagUpdatedRes)
  //   } catch (err) {
  //     return Promise.reject(err)
  //   }
  // }

  async batchUpdateTag(tagId, spuIds) {
    let data = {
      pTab: 0,
      viewStyle: 0,
      tagId,
      spuIds: spuIds.join(','),
      v2: 1,
      wmPoiId: this.wmPoiId
    }
    return this.instance3.post(urls.food.batchUpdateTag, data)
  }

  async batchDeleteFoods(skuIds) {
    let data = {
      opTab: 0,
      tagCat: 1,
      wmPoiId: this.wmPoiId,
      skuIds: skuIds.join(','),
      viewStyle: 0,
      v2: 1
    }
    return this.instance3.post(urls.food.batchDelete, data)
  }

  async getHighBoxPrice() {
    let params = {
      wmPoiId: this.wmPoiId
    }
    return this.instance3.get(urls.food.highBoxPrice, { params })
  }

  async syncTest(tagId) {
    let data = {
      type: 1,
      foodSyncParam: JSON.stringify({
        sourcePoiId: 10085676,
        targetPois: [this.wmPoiId],
        syncType: '2',
        syncAll: 0,
        opType: '1',
        tag: [{ tagId, syncAll: true, spu: [] }]
      }),
      csrfToken: this.csrfToken
    }
    return this.instance3.post(urls.food.syncFood, data)
  }

  async syncTags() {
    let data = {
      type: 1,
      foodSyncParam: JSON.stringify({
        sourcePoiId: 9383519,
        targetPois: [this.wmPoiId],
        syncType: '3',
        syncAll: 0,
        opType: '1',
        tag: [
          { tagId: 191265115, syncAll: true, spu: [] },
          { tagId: 191265120, syncAll: true, spu: [] },
          { tagId: 191265149, syncAll: true, spu: [] },
          { tagId: 191265163, syncAll: true, spu: [] },
          { tagId: 191715364, syncAll: true, spu: [] },
          { tagId: 189975212, syncAll: true, spu: [] },
          { tagId: 189975256, syncAll: true, spu: [] },
          { tagId: 193964658, syncAll: true, spu: [] }
        ]
      }),
      csrfToken: this.csrfToken
    }
    return this.instance3.post(urls.food.syncFood, data)
  }

  async setHighBoxPrice(tagI, sell) {
    try {
      const tagids = [214055264, 216092941, 216092995, 216093049, 216093080, 216093096, 216093110]
      const highBoxPriceR = await this.getHighBoxPrice()

      let canSave =
        highBoxPriceR.skuInSellOverall > highBoxPriceR.highBoxPriceCount || highBoxPriceR.highBoxPriceCount == 0

      console.log('highBoxPrice', '...')

      if (!canSave) {
        console.error({
          onSell: highBoxPriceR.skuInSellOverall,
          all: highBoxPriceR.highBoxPriceCount,
          wmPoiId: this.wmPoiId
        })
        if (tagI > 6) {
          console.error('sync maxed', tagI)
          if (sell) {
            console.log('waiting 10m', '...')
            await sleep(10 * 60 * 1000)
            await this.setHighBoxPrice(tagI, false)
          } else {
            await this.syncTags()
          }

          return Promise.reject({ err: 'sync maxed' })
        }
        await this.syncTest(tagids[tagI])
        await sleep(2 * 60 * 1000)
        return this.setHighBoxPrice(tagI + 1, true)
      } else {
        return Promise.resolve({ ok: true })
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async setHighBoxPrice2(boxPrice = 8, skuCnt = 1) {
    try {
      const highBoxPriceR = await this.getHighBoxPrice()

      let canSave =
        highBoxPriceR.skuInSellOverall >= (highBoxPriceR.highBoxPriceCount + skuCnt) ||
        highBoxPriceR.highBoxPriceCount == 0 ||
        boxPrice <= highBoxPriceR.normalBoxPrice

      console.log('highBoxPrice', '...')

      if (!canSave) {
        console.error({
          onSell: highBoxPriceR.skuInSellOverall,
          all: highBoxPriceR.highBoxPriceCount,
          wmPoiId: this.wmPoiId
        })
        let needCnt = (highBoxPriceR.highBoxPriceCount + skuCnt + 8 - highBoxPriceR.skuInSellOverall) / highBoxPriceR.highBoxPriceRate
        let pageSize = 500
        let pages = Array.from(new Array(Math.ceil(needCnt / pageSize)).keys())
          .map((v, i, a) => i == a.length - 1 ? needCnt % pageSize || pageSize : pageSize)

        let tags = await this.listTags()
        let startIndex = Math.max(
          ...[
            ...tags.filter(tag => /店铺公告\d+/.test(tag.name)).map(tag => parseInt(tag.name.replace('店铺公告', ''))),
            1
          ]
        )

        for (let [i, p] of pages.entries()) {
          try {
            let tagName = `店铺公告${startIndex + i + 1}`
            let spuListJson = Array.from(new Array(p).keys()).map(i => (
              {
                "id": 0, "wm_poi_id": this.wmPoiId, "isShippingTimeSyncPoi": 2, "shipping_time_x": "-",
                "name": `测试${i}`,
                "description": "说明产品，请勿下单", "min_order_count": "10", "unit": "份",
                "tag_name": tagName, "status": 0, "labelIds": "", "picture": "http%3A%2F%2Fp0.meituan.net%2Fwmproduct%2F2ba25f68ca66b4ab234607c3b510f8ff332609.png",
                "wmProductSkus": [{ "id": 0, "price": "88", "box_num": "1", "box_price": "0", "wm_food_spu_id": "", "spec": "", "valid": 1, "stock": -1 }]
              }
            ))
            await this.createTestFoods(spuListJson)
            await sleep(2000)
          } catch (error) {
            console.error(error)
          }
        }

        await sleep(1500)
        return this.setHighBoxPrice2(boxPrice, skuCnt)
      } else {
        return Promise.resolve({ ok: true })
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async updateMin(spuId) {
    let data = {
      wmPoiId: this.wmPoiId,
      spuId,
      minOrderCount: 2
    }
    return this.instance3.post(urls.food.updateMinOrderCount, data)
  }

  async getEditView(spuId) {
    let params = {
      wmPoiId: this.wmPoiId,
      spuId,
      from: 'new',
      productNew: 1
    }
    return instance2.get(urls.food.editView, { params })
  }

  async getEditView2(spuId) {
    let params = {
      spuId,
      wmPoiId: this.wmPoiId,
      clientId: 2,
      v2: 1
    }
    return this.instance3.get(urls.food.editView2, { params })
  }

  async searchProperty(tagName, wm_product_lib_tag_id = 1000000015) {
    let params = {
      tagName,
      wm_product_lib_tag_id,
      wmPoiId: this.wmPoiId
    }
    return this.instance3.get(urls.food.searchProp, { params })
  }

  async getTemplate(spuId, isNew = null) {
    let params = {
      spuId,
      wmPoiId: this.wmPoiId,
      isNew
    }
    return this.instance3.get(urls.food.getTemp, { params })
  }

  async getProperties(categoryId) {
    let params = {
      categoryId,
      needAll: 1
    }
    return this.instance3.get(urls.food.getProperties, { params })
  }

  async getMinOrderCount(name) {
    try {
      const food = await this.find(name)

      const editView = await this.getEditView(food.id)
      let pageModel = ''
      const parser = new htmlparser2.Parser({
        onopentag(name, attrs) {
          if (name == 'meta' && attrs.name == 'pageModel') {
            pageModel = attrs.data
          }
        }
      })
      parser.write(editView)
      parser.end()

      if (pageModel == '') return this.getMinOrderCount2(name)
      pageModel = JSON.parse(pageModel)
      return Promise.resolve(pageModel.wmProductSpu.min_order_count)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async getMinOrderCount2(name, catName) {
    try {
      const food = await this.find(name, catName)
      let { wmProductSpu } = await this.getEditView2(food.id)
      return Promise.resolve(wmProductSpu.min_order_count)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async save_(food) {
    let data = {
      wmPoiId: this.wmPoiId,
      wmFoodVoJson: JSON.stringify([food])
    }
    return this.instance3.post(urls.food.save, data)
  }

  async save(name, minOrderCount, weight, weightUnit, mainMat, attrList, prodStock = {}) {
    let that = this
    try {
      const food = await this.find(name)

      const editView = await this.getEditView(food.id)
      let pageModel = ''
      const parser = new htmlparser2.Parser({
        onopentag(name, attrs) {
          if (name == 'meta' && attrs.name == 'pageModel') {
            pageModel = attrs.data
          }
        }
      })
      parser.write(editView)
      parser.end()
      if (pageModel == '') return Promise.reject({ err: 'pageModel null' })
      pageModel = JSON.parse(pageModel)

      pageModel.wmProductSpu.attrList = pageModel.wmProductSpu.attrList || []

      const temp = await this.getTemplate(food.id)
      let category_id = temp.categoryId
      let wm_product_property_template_id = temp.wm_product_property_template_id

      let { ok, properties_values, unreqs } = await isPropMatchReqs(temp.propertiesKeys, temp.properties_values)
      if (!ok) return Promise.reject({ err: `properties required ${unreqs}` })

      if (mainMat) {
        let mainMatKey = temp.propertiesKeys.find(k => k.wm_product_lib_tag_name == '主料')
        if (!mainMatKey) return Promise.reject({ err: 'mat key not found' })
        const { property } = await this.searchProperty(mainMat)
        let p = property.find(v => v.name == mainMat)
        if (!p) return Promise.reject({ err: 'mainMat not found' })
        properties_values[mainMatKey.wm_product_lib_tag_id] = [
          {
            id: '',
            parent_tag_id: 0,
            wm_product_lib_tag_id: mainMatKey.wm_product_lib_tag_id,
            wm_product_lib_tag_name: '主料',
            value: p.name,
            value_id: p.wm_product_lib_tag_id,
            level: 1,
            is_leaf: 2,
            sequence: mainMatKey.sequence,
            propertyOpType: 3
          }
        ]
      }

      let spu = keep(pageModel.wmProductSpu, [
        'id',
        'wm_poi_id',
        'tag_id',
        'tag_name',
        'name',
        'description',
        'isShippingTimeSyncPoi',
        'shipping_time_x',
        'wmProductSkus',
        'labelList',
        'specialEffectPic',
        'min_order_count',
        'wmProductVideo',
        'search_terms',
        'labelValues',
        'customPropertiesValues',
        'productCardDisplayContent'
      ])

      spu = {
        ...spu,
        attrList:
          attrList ||
          pageModel.wmProductSpu.attrList.map(v => keep(v, ['id', 'wm_product_spu_id', 'no', 'name', 'value'])),
        labelList: spu.labelList || [],
        search_terms: spu.search_terms || [],
        labelValues: spu.labelValues || [],
        customPropertiesValues: spu.customPropertiesValues || [],
        category_id,
        wm_product_property_template_id,
        properties_values,
        min_order_count: minOrderCount || spu.min_order_count,
        wmProductSkus: spu.wmProductSkus.map(sku => ({
          ...sku,
          weight: weight || -2,
          weight_unit: weightUnit || sku.weight_unit || '1人份',
          wmProductStock: { ...sku.wmProductStock, ...prodStock } || {
            max_stock: 10000,
            auto_refresh: 0
          }
        }))
      }
      // fs.writeFileSync('log/logE.json', JSON.stringify(pageModel))
      return this.save_(spu)
    } catch (e) {
      return Promise.reject(e)
    }

    async function isPropMatchReqs(propertiesKeys, properties_values) {
      let unreqs = propertiesKeys
        .filter(k => k.is_required == 1) // 1.require 2.not
        .filter(k => !properties_values[k.wm_product_lib_tag_id])

      if (unreqs.length == 0) {
        return Promise.resolve({ ok: true, properties_values })
      } else {
        let r = unreqs.find(k => k.wm_product_lib_tag_name == '茶底')
        let r2 = unreqs.find(k => k.wm_product_lib_tag_name == '主料')
        if (r && r2) {
          const { property } = await that.searchProperty('奶茶')
          let p = property.find(v => v.name == '奶茶')
          let c = r.child.find(c => c.wm_product_lib_tag_name == '其他茶型')

          return isPropMatchReqs(propertiesKeys, {
            ...properties_values,
            [r.wm_product_lib_tag_id]: [
              {
                id: '',
                parent_tag_id: 0,
                wm_product_lib_tag_id: r.wm_product_lib_tag_id,
                wm_product_lib_tag_name: '茶底',
                value: c.wm_product_lib_tag_name,
                value_id: c.wm_product_lib_tag_id,
                level: 2,
                is_leaf: 1,
                sequence: r.sequence
              }
            ],
            [r2.wm_product_lib_tag_id]: [
              {
                id: '',
                parent_tag_id: 0,
                wm_product_lib_tag_id: r2.wm_product_lib_tag_id,
                wm_product_lib_tag_name: '主料',
                value: p.name,
                value_id: p.wm_product_lib_tag_id,
                level: 1,
                is_leaf: 2,
                sequence: r2.sequence,
                propertyOpType: 3
              }
            ]
          })
        }
        if (r) {
          let c = r.child.find(c => c.wm_product_lib_tag_name == '其他茶型')
          return isPropMatchReqs(propertiesKeys, {
            ...properties_values,
            [r.wm_product_lib_tag_id]: [
              {
                id: '',
                parent_tag_id: 0,
                wm_product_lib_tag_id: r.wm_product_lib_tag_id,
                wm_product_lib_tag_name: '茶底',
                value: c.wm_product_lib_tag_name,
                value_id: c.wm_product_lib_tag_id,
                level: 2,
                is_leaf: 1,
                sequence: r.sequence
              }
            ]
          })
        }
        return Promise.reject({ ok: false, unreqs })
      }
    }
  }

  async save2(name, catName, attrs, minOrder, desc, notDeliverAlone, weight, weightUnit, labels, pvs = {}) {
    let that = this
    try {
      const food = await this.find(name, catName)
      let { wmProductSpu } = await this.getEditView2(food.id)

      const temp = await this.getTemplate(food.id, 1)
      let category_id = temp.categoryId
      let wm_product_property_template_id = temp.wm_product_property_template_id

      // let { ok, properties_values, unreqs } = await isPropMatchReqs(temp.propertiesKeys, temp.properties_values)
      let properties_values = temp.properties_values
      // properties_values = { ...properties_values, ...pvs }
      // // if (!ok) return Promise.reject({ err: `properties required ${unreqs}` })

      // if (ok) {
      //   properties_values = Object.keys(properties_values).reduce((a, c) => {
      //     let values = properties_values[c].map(cv => {
      //       let r = temp.propertiesKeys.find(k => k.wm_product_lib_tag_name == cv.wm_product_lib_tag_name)
      //       return {
      //         ...r,
      //         wm_product_property_template_id,
      //         level: 2,
      //         is_leaf: 1,
      //         value: cv.value,
      //         value_id: cv.value_id,
      //         child: null
      //       }
      //     })
      //     return { ...a, [c]: values }
      //   }, {})
      // }

      const props = await this.getProperties(category_id)
      let no = props.saleAttrs.length + 1

      // console.log(wmProductSpu.newSpuAttrs.map(a => a.name == '份量').concat(getNewSpuAttrs(attrs, no)))
      let unitAttr = wmProductSpu.newSpuAttrs.findIndex(a => a.name == '份量')
      if (
        unitAttr != -1 &&
        wmProductSpu.newSpuAttrs[unitAttr].weight == -1 &&
        wmProductSpu.newSpuAttrs[unitAttr].weightUnit == ''
      ) {
        wmProductSpu.newSpuAttrs[unitAttr].weight = -2
        wmProductSpu.newSpuAttrs[unitAttr].weightUnit = '1人份'
      }

      if (weightUnit) {
        wmProductSpu.newSpuAttrs[unitAttr].weight = weight
        wmProductSpu.newSpuAttrs[unitAttr].weightUnit = weightUnit
      }

      let model = {
        id: wmProductSpu.id,
        wm_poi_id: wmProductSpu.wm_poi_id,
        tag_id: wmProductSpu.tag_id,
        tag_name: wmProductSpu.tag_name,
        category_id: category_id, //选中的品类id
        name: wmProductSpu.name,
        isShippingTimeSyncPoi: wmProductSpu.isShippingTimeSyncPoi || 2,
        shipping_time_x: wmProductSpu.shipping_time_x,
        min_order_count: minOrder || wmProductSpu.min_order_count,
        wmProductPics: wmProductSpu.wmProductPics,
        specialEffectPic: wmProductSpu.specialEffectPic,
        properties_values: properties_values,
        description: desc ?? wmProductSpu.description,
        labelValues: wmProductSpu.labelValues || [],
        labelList: labels ? [...(wmProductSpu.labelList ?? []), ...labels] : wmProductSpu.labelList ?? [], //
        newSpuAttrs: attrs
          ? getNewSpuAttrs(wmProductSpu.newSpuAttrs, attrs)
          : wmProductSpu.newSpuAttrs,
        stockAndBoxPriceSkus: wmProductSpu.wmProductSkus.map(sku => ({
          price: sku.price,
          unit: weightUnit || sku.unit || '1人份',
          box_price: sku.box_price,
          spec: sku.spec || `（${sku.unit || '1人份'}）`,
          weight: weight || sku.weight,
          wmProductLadderBoxPrice: sku.wmProductLadderBoxPrice || {
            status: 1,
            ladder_num: sku.box_num,
            ladder_price: sku.box_price
          },
          wmProductStock: sku.wmProductStock || {
            id: '0',
            stock: -1,
            max_stock: -1,
            auto_refresh: 1
          },
          attrList: sku.attrList.find(a => a.name == '份量')
            ? sku.attrList.find(a => a.name == '份量').value
              ? sku.attrList
              : [
                {
                  name: '份量',
                  name_id: 0,
                  value: `${sku.unit || '1人份'}__默认`,
                  value_id: 0,
                  no: 0
                }
              ]
            : sku.attrList
        })),
        unifiedPackagingFee: 2,
        wmProductLadderBoxPrice: wmProductSpu.wmProductLadderBoxPrice,
        wmProductStock: wmProductSpu.wmProductStock || {
          id: '0',
          stock: -1,
          max_stock: -1,
          auto_refresh: 1
        },
        productCardDisplayContent: wmProductSpu.productCardDisplayContent || ''
      }

      // console.log(JSON.stringify(model))
      const { ok } = await this.setHighBoxPrice2(
        Math.max(...food.wmProductSkus.map(sku => sku.boxPrice)), food.wmProductSkus.length
      )
      if (ok) {
        return this.save_(model)
      } else {
        return Promise.reject('sync failed')
      }

    } catch (e) {
      return Promise.reject(e)
    }

    function getSpecialEffectPic(wmProductPics) {
      let specialEffectPic = null
      if (wmProductPics && wmProductPics[0] && wmProductPics[0].specialEffectEnable !== 0) {
        const mainPic = wmProductPics[0]
        const { specialEffectEnable, specialEffectUrl, content } = mainPic
        specialEffectPic = {
          specialEffectEnable,
          specialEffectUrl: specialEffectUrl,
          content: content,
          isMaster: 1,
          specialEffectPicBase64: ''
        }
      } else {
        specialEffectPic = {
          specialEffectEnable: 2,
          specialEffectUrl: '',
          content: '',
          isMaster: 1,
          specialEffectPicBase64: ''
        }
      }
      return specialEffectPic
    }

    function getNewSpuAttrs(oldAttrs, newAttrs) {
      // const maxNo = Math.max(...newAttrs.map(v => v.no))
      const 份量 = oldAttrs.filter(v => v.name == '份量') // .map(v => ({ ...v, sell_status: 0 }))
      // const 其他 = oldAttrs.filter(v => v.name != '份量')
      //   .filter(v => !newAttrs.map(v => v.name).includes(v.name))
      //   .filter(v => v.name != '甜度')
      //   .map((v, i) => ({
      //     ...v,
      //     no: maxNo + 1 + i
      //   }))
      console.log(JSON.stringify(份量.concat(newAttrs)))
      return 份量.concat(newAttrs) //.concat(其他)
    }

    async function isPropMatchReqs(propertiesKeys, properties_values, wm_product_property_template_id) {
      let unreqs = propertiesKeys
        .filter(k => k.is_required == 1) // 1.require 2.not
        .filter(k => !properties_values[k.wm_product_lib_tag_id])

      if (unreqs.length == 0) {
        return Promise.resolve({ ok: true, properties_values })
      } else {
        let r = unreqs.find(k => k.wm_product_lib_tag_name == '茶底')

        if (r) {
          let c = r.child.find(c => c.wm_product_lib_tag_name == '其他茶型')
          return isPropMatchReqs(
            propertiesKeys,
            {
              ...properties_values,
              [r.wm_product_lib_tag_id]: [
                {
                  ...r,
                  wm_product_property_template_id,
                  level: c.level,
                  is_leaf: c.is_leaf,
                  value: c.wm_product_lib_tag_name,
                  value_id: c.wm_product_lib_tag_id,
                  child: null
                }
              ]
            },
            wm_product_property_template_id
          )
        }
        return Promise.reject({ ok: false, unreqs })
      }
    }
  }

  async save3(name, attrs) {
    let that = this
    try {
      const food = await this.find(name)
      let { wmProductSpu } = await this.getEditView2(food.id)

      const temp = await this.getTemplate(food.id, 1)
      let category_id = temp.categoryId
      let wm_product_property_template_id = temp.wm_product_property_template_id

      // let { ok, properties_values, unreqs } = await isPropMatchReqs(temp.propertiesKeys, temp.properties_values)
      let properties_values = temp.properties_values
      // // if (!ok) return Promise.reject({ err: `properties required ${unreqs}` })

      // if (ok) {
      //   properties_values = Object.keys(properties_values).reduce((a, c) => {
      //     let values = properties_values[c].map(cv => {
      //       let r = temp.propertiesKeys.find(k => k.wm_product_lib_tag_name == cv.wm_product_lib_tag_name)
      //       return {
      //         ...r,
      //         wm_product_property_template_id,
      //         level: 2,
      //         is_leaf: 1,
      //         value: cv.value,
      //         value_id: cv.value_id,
      //         child: null
      //       }
      //     })
      //     return { ...a, [c]: values }
      //   }, {})
      // }

      const props = await this.getProperties(category_id)
      let no = props.saleAttrs.length + 1

      // console.log(wmProductSpu.newSpuAttrs.map(a => a.name == '份量').concat(getNewSpuAttrs(attrs, no)))
      let unitAttr = wmProductSpu.newSpuAttrs.findIndex(a => a.name == '份量')
      if (
        unitAttr != -1 &&
        wmProductSpu.newSpuAttrs[unitAttr].weight == -1 &&
        wmProductSpu.newSpuAttrs[unitAttr].weightUnit == ''
      ) {
        wmProductSpu.newSpuAttrs[unitAttr].weight = -2
        wmProductSpu.newSpuAttrs[unitAttr].weightUnit = '1人份'
      }

      let groupNames = Array.from(new Set(wmProductSpu.newSpuAttrs.map(v => v.name)))
      let groups = groupNames.reduce((c, v) => ({ ...c, [v]: wmProductSpu.newSpuAttrs.filter(k => k.name == v) }), {})
      let subGroupNames = groupNames.filter(v => v.includes('口味'))
      for (let sgn of subGroupNames) {
        groups[sgn] = groups[sgn]
          .filter(v => !/烧烤味?粉?|甘梅味?|蒜香[酱油]?酱?|辣椒粉|酸甜酱/.test(v.value))
          .concat(['辣椒粉', '酸甜酱'].map(k => ({ ...groups[sgn][0], value: k })))
          .map((v, i) => ({ ...v, value_sequence: i + 1 }))
      }
      let newSpuAttrs = flatten(groupNames.map(name => groups[name]))
      console.log(newSpuAttrs)

      let model = {
        id: wmProductSpu.id,
        wm_poi_id: wmProductSpu.wm_poi_id,
        tag_id: wmProductSpu.tag_id,
        tag_name: wmProductSpu.tag_name,
        category_id: category_id, //选中的品类id
        name: wmProductSpu.name,
        isShippingTimeSyncPoi: wmProductSpu.isShippingTimeSyncPoi || 2,
        shipping_time_x: wmProductSpu.shipping_time_x,
        min_order_count: wmProductSpu.min_order_count,
        wmProductPics: wmProductSpu.wmProductPics,
        specialEffectPic: wmProductSpu.specialEffectPic,
        properties_values: properties_values,
        description: wmProductSpu.description,
        labelValues: wmProductSpu.labelValues || [],
        labelList: wmProductSpu.labelList || [], //
        newSpuAttrs,
        stockAndBoxPriceSkus: wmProductSpu.wmProductSkus.map(sku => ({
          price: sku.price,
          unit: sku.unit || '1人份',
          box_price: sku.box_price,
          spec: sku.spec || `（${sku.unit || '1人份'}）`,
          weight: sku.weight,
          wmProductLadderBoxPrice: sku.wmProductLadderBoxPrice || {
            status: 1,
            ladder_num: sku.box_num,
            ladder_price: sku.box_price
          },
          wmProductStock: sku.wmProductStock || {
            id: '0',
            stock: -1,
            max_stock: -1,
            auto_refresh: 1
          },
          attrList: sku.attrList.find(a => a.name == '份量')
            ? sku.attrList.find(a => a.name == '份量').value
              ? sku.attrList
              : [
                {
                  name: '份量',
                  name_id: 0,
                  value: `${sku.unit || '1人份'}__默认`,
                  value_id: 0,
                  no: 0
                }
              ]
            : sku.attrList
        })),
        unifiedPackagingFee: wmProductSpu.unifiedPackagingFee,
        wmProductLadderBoxPrice: wmProductSpu.wmProductLadderBoxPrice,
        wmProductStock: wmProductSpu.wmProductStock || {
          id: '0',
          stock: -1,
          max_stock: -1,
          auto_refresh: 1
        },
        productCardDisplayContent: wmProductSpu.productCardDisplayContent || ''
      }

      return this.save_(model)
    } catch (e) {
      return Promise.reject(e)
    }

    async function isPropMatchReqs(propertiesKeys, properties_values, wm_product_property_template_id) {
      let unreqs = propertiesKeys
        .filter(k => k.is_required == 1) // 1.require 2.not
        .filter(k => !properties_values[k.wm_product_lib_tag_id])

      if (unreqs.length == 0) {
        return Promise.resolve({ ok: true, properties_values })
      } else {
        let r = unreqs.find(k => k.wm_product_lib_tag_name == '茶底')

        if (r) {
          let c = r.child.find(c => c.wm_product_lib_tag_name == '其他茶型')
          return isPropMatchReqs(
            propertiesKeys,
            {
              ...properties_values,
              [r.wm_product_lib_tag_id]: [
                {
                  ...r,
                  wm_product_property_template_id,
                  level: c.level,
                  is_leaf: c.is_leaf,
                  value: c.wm_product_lib_tag_name,
                  value_id: c.wm_product_lib_tag_id,
                  child: null
                }
              ]
            },
            wm_product_property_template_id
          )
        }
        return Promise.reject({ ok: false, unreqs })
      }
    }
  }

  async save4(spuId, attrs, cateId, pvs, desc) {
    try {
      let { wmProductSpu } = await this.getEditView2(spuId)

      const temp = await this.getTemplate(spuId, 1)
      let category_id = cateId ?? temp.categoryId

      let properties_values = temp.properties_values

      let unitAttr = wmProductSpu.newSpuAttrs.findIndex(a => a.name == '份量')
      if (
        unitAttr != -1 &&
        wmProductSpu.newSpuAttrs[unitAttr].weight == -1 &&
        wmProductSpu.newSpuAttrs[unitAttr].weightUnit == ''
      ) {
        wmProductSpu.newSpuAttrs[unitAttr].weight = -2
        wmProductSpu.newSpuAttrs[unitAttr].weightUnit = '1人份'
      }

      let model = {
        id: wmProductSpu.id,
        wm_poi_id: wmProductSpu.wm_poi_id,
        tag_id: wmProductSpu.tag_id,
        tag_name: wmProductSpu.tag_name,
        category_id: category_id, //选中的品类id
        name: wmProductSpu.name,
        isShippingTimeSyncPoi: wmProductSpu.isShippingTimeSyncPoi || 2,
        shipping_time_x: wmProductSpu.shipping_time_x,
        min_order_count: wmProductSpu.min_order_count,
        wmProductPics: wmProductSpu.wmProductPics,
        specialEffectPic: wmProductSpu.specialEffectPic,
        properties_values: pvs ?? properties_values,
        description: desc ?? wmProductSpu.description,
        labelValues: wmProductSpu.labelValues || [],
        labelList: wmProductSpu.labelList || [], //
        newSpuAttrs: attrs
          ? wmProductSpu.newSpuAttrs.filter(a => a.name == '份量').concat(attrs)
          : wmProductSpu.newSpuAttrs,
        stockAndBoxPriceSkus: wmProductSpu.wmProductSkus.map(sku => ({
          price: sku.price,
          unit: sku.unit || '1人份',
          box_price: sku.box_price,
          spec: sku.spec || `（${sku.unit || '1人份'}）`,
          weight: sku.weight,
          wmProductLadderBoxPrice: sku.wmProductLadderBoxPrice || {
            status: 1,
            ladder_num: sku.box_num,
            ladder_price: sku.box_price
          },
          wmProductStock: sku.wmProductStock || {
            id: '0',
            stock: -1,
            max_stock: -1,
            auto_refresh: 1
          },
          attrList: sku.attrList.find(a => a.name == '份量')
            ? sku.attrList.find(a => a.name == '份量').value
              ? sku.attrList
              : [
                {
                  name: '份量',
                  name_id: 0,
                  value: `${sku.unit || '1人份'}__默认`,
                  value_id: 0,
                  no: 0
                }
              ]
            : sku.attrList
        })),
        unifiedPackagingFee: 2,
        wmProductLadderBoxPrice: wmProductSpu.wmProductLadderBoxPrice,
        wmProductStock: wmProductSpu.wmProductStock || {
          id: '0',
          stock: -1,
          max_stock: -1,
          auto_refresh: 1
        },
        productCardDisplayContent: wmProductSpu.productCardDisplayContent || ''
      }

      // console.log(JSON.stringify(model))
      return this.save_(model)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async save5({ name, catName, food, foodEdit, foodTemp }, updates) {
    const empty = (val) => val == null || val == ''

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

    const detailInfo = (food, foodEdit, foodTemp) => {
      const template = foodTemp
      return {
        category_id: template.categoryId,
        properties_values: template.properties_values, // ✔
      }
    }

    const sellInfo = (food, foodEdit) => {
      const { wmProductSpu } = foodEdit

      const stockAndBoxPriceSkus = () => {
        let g_new_spu_attrs = combineArray(Object.values(wmProductSpu.newSpuAttrs.filter(v => v.name == '份量' || v.price > 0)
          .reduce((p, v, _, a) => ({ ...p, [v.name]: a.filter(k => k.name == v.name) }), {})))

        return g_new_spu_attrs.map(v => {
          let wa = v.find(k => k.name == '份量')
          let unit = wa.weight == -2 ? wa.weightUnit : `${wa.weight}${wa.weightUnit}`
          let runit = /\d+人份/.test(unit) ? unit : '约' + unit
          let attrList = v.map(k => ({ ...k, value: k.name == '份量' && empty(k.value) ? unit : k.value }))
            .map(k => keepBy(k, ['name', 'name_id', 'value', 'value_id'].concat(k.name == '份量' ? ['no'] : [])))
          let spec = (empty(wa.value) ? runit : `${wa.value}（${runit}）`) + ' '
            v.filter(k => k.name != '份量').map(k => k.value).join('·')
          let osku = wmProductSpu.wmProductSkus.find(k => isSameArrayBy(k.attrList, v, ['name', 'value']))

          return {
            attrList,
            box_price: osku?.box_price ?? 0,
            price: wa.price,
            spec,
            unit,
            weight: wa.weight,
            wmProductLadderBoxPrice: {
              ladder_num: osku?.box_num ?? 1,
              ladder_price: osku?.box_price ?? 0,
              status: 1
            },
            wmProductStock: {
              id: "0",
              stock: osku?.stock ?? "10000",
              max_stock: "-1",
              auto_refresh: 1
            }
          }
        })
      }

      const tStockAndBoxPrice = (stockNBoxes) => {
        return stockNBoxes
          .map(v => ({
            ...v,
            wmProductLadderBoxPrice: v.wmProductLadderBoxPrice ?? { ladder_num: v.box_num ?? 1, ladder_price: v.box_price ?? 0, status: 1 },
            wmProductStock: v.wmProductStock ?? { id: '0', stock: v.stock ?? '10000', max_stock: '-1', auto_refresh: 1 }
          }))
          .map(v => keep(v, ['attrList', 'box_price', 'price', 'spec', 'unit', 'weight', 'wmProductLadderBoxPrice', 'wmProductStock']))
      }

      return {
        newSpuAttrs: wmProductSpu.newSpuAttrs.map(v => ({ ...v, no: v.name == '份量' ? 0 : v.no })),
        stockAndBoxPriceSkus: wmProductSpu.stockAndBoxPriceSkus ?
          tStockAndBoxPrice(wmProductSpu.stockAndBoxPriceSkus) :
          stockAndBoxPriceSkus(),
        unifiedPackagingFee: wmProductSpu.unifiedPackagingFee,
        wmProductLadderBoxPrice: wmProductSpu.wmProductLadderBoxPrice ??
          { ladder_num: wmProductSpu.wmProductSkus[0].box_num ?? 1, ladder_price: wmProductSpu.wmProductSkus[0].box_price ?? 0, status: 1 },
        wmProductStock: wmProductSpu.wmProductStock ??
          { id: "0", stock: wmProductSpu.wmProductSkus[0].stock ?? "10000", max_stock: "-1", auto_refresh: 1 }
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
        wmProductVideo: wmProductSpu.wmProductVideo,
        productCardDisplayContent: wmProductSpu.productCardDisplayContent || '',
        labelValues: wmProductSpu.labelValues || [{ sequence: 1, value: "" }, { sequence: 2, value: "" }],
      }
    }

    if (name && catName) {
      food = await this.find(name, catName)
      foodEdit = await this.getEditView2(food.id)
      foodTemp = await this.getTemplate(food.id, 1)
    }

    let basic = basicInfo(food, foodEdit)
    let detail = detailInfo(food, foodEdit, foodTemp)
    let sell = sellInfo(food, foodEdit)
    let advance = advanceInfo(food, foodEdit)

    let model = {
      ...basic,
      ...detail,
      ...sell,
      ...advance,
      ...updates
    }

    // console.log('%o', model)
    fs.appendFileSync('temp.json', JSON.stringify(model))

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

async function test() {
  try {
    let attrs = [
      { name: '底料', values: ['椰汁底'] },
      { name: '温度', values: ['冷', '温热'] }
    ]
  } catch (error) {
    console.error(error)
  }
}

let skuT = {
  weight_unit: '1人份',
  weight: -2,
  price: '13.8',
  stock: '-1',
  unifiedPackagingFee: 2,
  unifiedPackagingFeeType: 2,
  unifiedWeightFeeType: 2,
  wmProductStock: { max_stock: '-1', auto_refresh: 1 },
  wmProductLadderBoxPrice: { ladder_num: 1, ladder_price: '1', status: 1 }
}
// test()
let foodT = [
  {
    description: '说明产品，请勿下单',
    name: '测试2',
    wm_poi_id: '10085676',
    tag_id: 214055264,
    tag_name: '店铺公告1',
    isShippingTimeSyncPoi: 2,
    shipping_time_x: '-',
    min_order_count: 1,
    wmProductPics: [
      {
        pic_large_url: 'http://p0.meituan.net/wmproduct/2ba25f68ca66b4ab234607c3b510f8ff332609.png',
        pic_small_url: 'http://p0.meituan.net/wmproduct/2ba25f68ca66b4ab234607c3b510f8ff332609.png',
        is_quality_low: false,
        quality_score: 1,
        specialEffectEnable: 0,
        picPropagandaList: [],
        sequence: 0
      }
    ],
    specialEffectPic: null,
    category_id: 115250,
    labelList: [],
    newSpuAttrs: [
      {
        name: '份量',
        name_id: 0,
        price: '88',
        value: '',
        value_id: 0,
        no: 0,
        mode: 2,
        weight: 1,
        weightUnit: '克',
        sell_status: 0,
        value_sequence: 0
      }
    ],
    stockAndBoxPriceSkus: [],
    unifiedPackagingFee: 1,
    wmProductLadderBoxPrice: { status: 1, ladder_num: 1, ladder_price: 0 },
    wmProductStock: { id: 0, stock: 10000, max_stock: 10000, auto_refresh: 1 },
    productCardDisplayContent: '',
    labelValues: [
      { sequence: 1, value: '' },
      { sequence: 2, value: '' }
    ]
  }
]
