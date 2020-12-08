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
        v =>
          dayjs.unix(v.utime).month() == dayjs().month() &&
          dayjs.unix(v.utime).date() == dayjs().date()
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
