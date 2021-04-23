import instance, { urls } from '../base/index.js'

export default class Order {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
    this.refund = new Refund(appPoiCode)
  }

  async confirm(orderId) {
    let params = {
      // app_poi_code: this.appPoiCode,
      order_id: orderId
    }
    return instance.get(urls.order.confirm, { params })
  }

  async cancel(orderId, reason, reasonCode) {
    let params = {
      order_id: orderId,
      reason,
      reason_code: reasonCode
    }
    return instance.get(urls.order.cancel, { params })
  }

  async getOrderDaySeq() {
    let params = {
      app_poi_code: this.appPoiCode
    }
    return instance.get(urls.order.getOrderDaySeq, { params })
  }

  async getOrderIdByDaySeq(dateTime, daySeq) {
    let params = {
      app_poi_code: this.appPoiCode,
      date_time: dateTime,
      day_seq: daySeq
    }
    return instance.get(urls.order.getOrderIdByDaySeq, { params })
  }

  async batchPullPhoneNumber(offset, limit) {
    let data = {
      app_poi_code: this.appPoiCode,
      offset,
      limit
    }
    return instance.post(urls.order.batchPullPhoneNumber, data)
  }

  async getRiderInfoPhoneNumber(offset, limit) {
    let data = {
      app_poi_code: this.appPoiCode,
      offset,
      limit
    }
    return instance.post(urls.order.getRiderInfoPhoneNumber, data)
  }

  async delivering(orderId, courierName, courierPhone) {
    let params = {
      order_id: orderId,
      courier_name: courierName,
      courier_phone: courierPhone
    }
    return instance.get(urls.order.delivering, { params })
  }

  async arrived(orderId) {
    let params = {
      order_id: orderId
    }
    return instance.get(urls.order.arrived, { params })
  }

}

class Refund {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async agree(orderId, reason) {
    let params = {
      order_id: orderId,
      reason
    }
    return instance.get(urls.order.refund.agree, { params })
  }

  async reject(orderId, reason) {
    let params = {
      order_id: orderId,
      reason
    }
    return instance.get(urls.order.refund.reject, { params })
  }
}


async function test() {
  try {
    let order = new Order('t_QAqeUFmhSF')
    // console.log(await order.getOrderDaySeq())
    // console.log(await order.getOrderIdByDaySeq(20210422, 3))
    // console.log(await order.batchPullPhoneNumber(0, 20))
    console.log(await order.cancel(27004711208734383n, '菜卖光了', 1001))
    // console.log(await order.refund.reject(27004713737426282n, '顾客原因'))

  } catch (error) {
    console.error(error)
  }
}

// test()