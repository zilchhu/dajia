import instance, { urls } from './base.js'
import dayjs from 'dayjs'

export default class Act {
  constructor(wmPoiId) {
    this.wmPoiId = wmPoiId
    this.actList = null
  }

  async list() {
    const data = {
      wmPoiId: this.wmPoiId,
      wmActPoiId: 1,
      dataSource: 1,
      wmActPolicyId: 1001
    }
    return instance.post(urls.act.list, data)
  }

  async save_(poiPolicy) {
    let data = {
      wmPoiId: this.wmPoiId,
      poiPolicy: JSON.stringify(poiPolicy),
      isAgree: 1,
      wmActType: 17,
      policyId: 1001
    }
    return instance.post(urls.act.save, data)
  }

  async save(actData) {
    let poiPolicy = {
      online_pay: 0,
      foods: [
        {
          ...actData,

          actInfo: {
            discount: 'NaN',
            origin_price: actData.originPrice,
            act_price: actData.actPrice
          },
          WmActPriceVo: {
            originPrice: actData.originPrice,
            actPrice: actData.actPrice,
            mtCharge: actData.mtCharge,
            agentCharge: actData.agentCharge,
            poiCharge:
              actData.originPrice - actData.actPrice - actData.mtCharge - actData.agentCharge
          },

          wmPoiId: this.wmPoiId,
          orderLimit: actData.orderLimit,

          wmActPolicyId: 1001,
          todaySaleNum: -1,
          priority: 0,
          spec: '',
          
          period: '00:00-23:59',
          weeksTime: '1,2,3,4,5,6,7',
          startTime: dayjs().startOf('day').unix(),
          endTime: dayjs().startOf('day').add(365, 'day').unix(),
          limitTimeSale: '-1',
          autoDelayDays: 30,
          
        }
      ]
    }
    return this.save_(poiPolicy)
  }

  async delete(actIds) {
    let data = {
      wmPoiId: this.wmPoiId,
      deleteIds: actIds.join(','),
      wmPolicyId: 1001
    }
    return instance.post(urls.act.delete, data)
  }
}
