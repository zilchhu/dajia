import instance, { urls } from '../base/index.js'

export default class Poi {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
    this.poiTag = new PoiTag()
    this.weight = new Weight(appPoiCode)
    this.bill = new Bill(appPoiCode)
    this.logistics = new Logistics(appPoiCode)
    this.shippingTime = new Shippingtime(appPoiCode)
  }

  async mget(appPoiCodes) {
    let params = {
      app_poi_codes: appPoiCodes
    }
    return instance.get(urls.poi.mget, { params })
  }

  async open() {
    let data = {
      app_poi_code: this.appPoiCode
    }
    return instance.post(urls.poi.open, data)
  }

  async close() {
    let data = {
      app_poi_code: this.appPoiCode
    }
    return instance.post(urls.poi.close, data)
  }

  async online() {
    let data = {
      app_poi_code: this.appPoiCode
    }
    return instance.post(urls.poi.online, data)
  }

  async offline() {
    let data = {
      app_poi_code: this.appPoiCode
    }
    return instance.post(urls.poi.offline, data)
  }

  async getids() {
    return instance.get(urls.poi.getids, { params: {} })
  }
}

class PoiTag {
  async list() {
    return instance.post(urls.poi.poiTag.list, {})
  }
}

class Weight {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async canOpen() {
    let params = {
      app_poi_code: this.appPoiCode
    }
    return instance.get(urls.poi.weight.canOpen, { params })
  }

  async open() {
    let data = {
      app_poi_code: this.appPoiCode
    }
    return instance.post(urls.poi.weight.open, data)
  }
}

class Bill {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async list(startDate, endDate, offset, limit) {
    let params = {
      app_poi_code: this.appPoiCode,
      start_date: startDate,
      end_date: endDate,
      offset,
      limit
    }
    return instance.get(urls.poi.bill.list, { params })
  }
}

class Logistics {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async isDelayPush() {
    let data = {
      app_poi_code: this.appPoiCode
    }
    return instance.post(urls.poi.logistics.isDelayPush, data)
  }

  async setDelayPush(delaySeconds) {
    let data = {
      app_poi_code: this.appPoiCode,
      delay_seconds: delaySeconds
    }
    return instance.post(urls.poi.logistics.setDelayPush, data)
  }
}

class Shippingtime {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async update(shippingTime) {
    let data = {
      app_poi_code: this.appPoiCode,
      shipping_time: shippingTime
    }
    return instance.post(urls.poi.shippingtime.update, data)
  }
}
