import instance, { urls } from './base.js'
import sleep from 'sleep-promise'
import dayjs from 'dayjs'
import download from 'download'
import xls2Json from 'xls-to-json'
import util from 'util'

const axls2Json = util.promisify(xls2Json)

export default class Food {
  constructor(wmPoiId) {
    this.wmPoiId = wmPoiId
  }

  async search_(name) {
    let params = {
      wmPoiId: this.wmPoiId,
      name,
      pageNum: 1,
      pageSize: 30,
      needTagList: 0
    }
    return instance.get(urls.food.search, { params })
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
      return Promise.resolve(res.productList)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async find(name) {
    try {
      const searchRes = await this.search_(name)
      if (!searchRes || !searchRes.productList) return Promise.reject(new Error('find failed'))
      const product = searchRes.productList.find(v => v.name == name)
      if (!product) return Promise.reject(new Error('not find'))
      return Promise.resolve(product)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async download_() {
    const params = {
      wmPoiId: this.wmPoiId,
      v2: 1
    }
    return instance.get(urls.download.food.down, { params })
  }

  async listDowns_() {
    const params = {
      wmPoiId: this.wmPoiId,
      pageSize: 10,
      pageNum: 1,
      type: 6
    }
    return instance.get(urls.download.food.list, { params })
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
    return instance.get(urls.food.list, { params })
  }

  async listTags() {
    try {
      const list2_Res = await this.list2_()
      if (!list2_Res || !list2_Res.tagList) return Promise.reject({ err: 'tag list failed' })
      return Promise.resolve(list2_Res.tagList)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async listFoods(tagId) {
    try {
      const list2_Res = await this.list2_({ tagId, pageSize: 50 })
      if (!list2_Res || !list2_Res.productList) return Promise.reject({ err: 'product list failed' })
      return Promise.resolve(list2_Res.productList)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async searchTag(name) {
    try {
      const tags = await this.listTags()
      const tag = tags.find(v => v.name.includes(name))
      if (!tag) return Promise.reject({ err: 'tag1 not find' })
      return Promise.resolve(tag)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async updatePrice(skuId, price) {
    let data = {
      wmPoiId: this.wmPoiId,
      skuId,
      price
    }
    return instance.post(urls.food.updatePrice, data)
  }

  async batchUpdateSkus_(spuIds, skuIds, skusInfo) {
    let data = {
      wmPoiId: this.wmPoiId,
      spuIds: spuIds.join(','),
      skuIds: skuIds.join(','),
      skusInfo: JSON.stringify(skusInfo)
    }
    return instance.post(urls.food.batchUpdateSkus, data)
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
    return instance.post(urls.food.batchUpdateBoxPrice, data)
  }

  async createTestFood(tagId, tagName) {
    let data = {
      wmPoiId: this.wmPoiId,
      wmFoodVoJson: JSON.stringify(
        foodT.map(t => ({
          ...t,
          wm_poi_id: this.wmPoiId,
          tag_id: tagId,
          tag_name: tagName
        }))
      )
    }
    return instance.post(urls.food.save, data)
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
    return instance.post(urls.food.updateImg, data)
  }

  async batchUpdateStock(skuIds, stock = 10000) {
    let data = {
      wmPoiId: this.wmPoiId,
      skuIds: skuIds.join(','),
      stock,
      maxStock: 10000,
      autoRefresh: 1,
      v2: 1,
      viewStyle: 0,
      opTab: 0,
      tagCat: 1
    }
    return instance.post(urls.food.batchUpdateStock, data)
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
    return instance.post(urls.food.updateName, data)
  }

  async updateFoodCatSeq(tagId, targetSeq) {
    let data = {
      wmPoiId: this.wmPoiId,
      tagId,
      targetSeq
    }
    return instance.post(urls.food.updateFoodCatSeq, data)
  }

  async updateFoodCatName_(tag, tagName) {
    let data = {
      wmPoiId: this.wmPoiId,
      tagInfo: JSON.stringify({
        id: tag.id,
        name: tag.name.replace('冬至汤圆', tagName),
        description: tag.description,
        top_flag: tag.topFlag,
        tag_type: tag.tagType,
        time_zone: tag.timeZone,
        sequence: tag.sequence
      })
    }
    return instance.post(urls.food.updateFoodCatName, data)
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

  async batchUpdateTag(tagId, spuIds) {
    let data = {
      pTab: 0,
      viewStyle: 0,
      tagId,
      spuIds: spuIds.join(','),
      v2: 1,
      wmPoiId: this.wmPoiId
    }
    return instance.post(urls.food.batchUpdateTag, data)
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
    return instance.post(urls.food.batchDelete, data)
  }
}

let skuT = {
  spec: '1',
  weight_unit: '1人份',
  weight: -2,
  price: '88',
  stock: '10000',
  wmProductStock: { max_stock: '10000', auto_refresh: 1 },
  wmProductLadderBoxPrice: { ladder_num: 1, ladder_price: '2', status: 1 }
}

let foodT = [
  {
    // wm_poi_id: '8221674',
    // tag_id: 124781406,
    // tag_name: '┏ 🙈 ┓店铺公告',
    name: '饺子、冬至、汤圆',
    description: '说明产品，请勿下单',
    isShippingTimeSyncPoi: 2,
    shipping_time_x: '-',
    attrList: [],
    wmProductSkus: [
      {
        spec: '',
        price: '88',
        stock: 10000,
        wmProductStock: {
          max_stock: 10000,
          auto_refresh: 1
        },
        box_price: '0',
        wmProductLadderBoxPrice: {
          status: 2,
          ladder_num: 1,
          ladder_price: ''
        },
        upc_code: '',
        source_food_code: '',
        locator_code: '',
        weight: '1',
        weight_unit: '克',
        id: '',
        wm_food_spu_id: '',
        wmProductPics: [
          {
            pic_large_url: 'http://p1.meituan.net/wmproduct/a1164ddc4d5d4263975e7471f773695149977.png',
            pic_small_url: 'http://p1.meituan.net/wmproduct/a1164ddc4d5d4263975e7471f773695149977.png',
            sequence: 1,
            is_quality_low: false,
            quality_score: 1
          }
        ],
        tag_name: '',
        description: ''
      }
    ],
    labelList: [],
    specialEffectPic: null,
    min_order_count: 1,
    wmProductVideo: null,
    search_terms: [],
    labelValues: [],
    category_id: 115250,
    properties_values: {},
    customPropertiesValues: [],
    productCardDisplayContent: null,
    suggestTraceInfoList: [
      {
        traceId: '-1701480564776619457',
        traceType: 100003,
        setTraceType: true,
        setTraceId: true
      },
      {
        traceId: '149910698955644605',
        traceType: 100002,
        setTraceId: true,
        setTraceType: true
      }
    ]
  }
]
