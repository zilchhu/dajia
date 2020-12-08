import instance, { urls } from './base.js'
import dayjs from 'dayjs'

export default class Act {
  constructor(wmPoiId) {
    this.wmPoiId = wmPoiId
    this.actList = null
    this.reduction = new Reduction(wmPoiId)
    this.tradeIn = new Tradein(wmPoiId)
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
          startTime: dayjs()
            .startOf('day')
            .unix(),
          endTime: dayjs()
            .startOf('day')
            .add(365, 'day')
            .unix(),
          limitTimeSale: '-1',
          autoDelayDays: 30
        }
      ]
    }
    return this.save_(poiPolicy)
  }

  async find(name) {
    try {
      let listRes = await this.list()
      if (!listRes || !listRes.list) return Promise.reject({err: 'find failed'})

      let act = listRes.find(v => v.itemName == name)
      if (!act) return Promise.reject({err: 'not find'})
      return Promise.resolve(act)
    } catch (err) {
      return Promise.reject(err)
    }
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

class Reduction {
  constructor(wmPoiId) {
    this.wmPoiId = wmPoiId
  }

  async save(wmActPoiId, startTime, endTime, poiPolicy) {
    let data = {
      wmPoiId: this.wmPoiId,
      wmActPoiId,
      weeksTime: '1,2,3,4,5,6,7',
      period: '00:00-23:59',
      isAgree: 1,
      type: 2,
      valid: 1,
      isSettle: 1,
      autoDelayDays: 30,
      startTime,
      endTime,
      poiPolicy: JSON.stringify(poiPolicy)
    }
    return instance.post(urls.act.reduction.save, data)
  }

  async list() {
    let params = {
      type: 2,
      wmPoiId: this.wmPoiId,
      startTime: null,
      endTime: null,
      status: 1,
      effect: false,
      pageNum: 1,
      pageSize: 200
    }
    return instance.get(urls.act.reduction.list, { params })
  }

  async find() {
    try {
      const listRes = await this.list()
      if (!listRes || !listRes.list) return Promise.reject({err: 'find failed'})
      const reduction = listRes.list.find(v => v.status == 1)
      if (!reduction) return Promise.reject({err: 'not find'})
      return Promise.resolve(reduction)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async delete(wmActPoiId) {
    let data = {
      wmPoiId: this.wmPoiId,
      wmActPoiId,
      type: 2
    }
    return instance.post(urls.act.reduction.delete, data)
  }
}

class Tradein {
  constructor(wmPoiId) {
    this.wmPoiId = wmPoiId
  }

  async list() {
    let params = {
      type: 40,
      wmPoiId: this.wmPoiId,
      startTime: null,
      endTime: null,
      status: 1,
      effect: false,
      pageNum: 1,
      pageSize: 200
    }
    return instance.get(urls.act.tradein.list, { params })
  }

  async find(name) {
    try {
      let listRes = await this.list()
      if (!listRes || !listRes.list) return Promise.reject({err: 'find failed'})

      listRes = listRes.list.map(v => ({
        ...v,
        policy: JSON.parse(v.policy)
      }))

      let tradein = listRes.find(v => v.policy.itemName == name)
      if (!tradein) return Promise.reject({err: 'not find'})
      return Promise.resolve(tradein)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async delete(ids) {
    let data = {
      wmPoiId: this.wmPoiId,
      type: 40,
      listIds: ids.join(','),
      policyType: 40
    }
    return instance.post(urls.act.tradein.delete, data)
  }
}

let poiPolicyT = {
  online_pay: 1,
  is_settle: 1,
  activityUuid: 'f6d6ba68-cd3b-4e27-aec6-ec8d00ae6aa1',
  policy_detail: [
    {
      discounts: [
        { code: 1, discount: 9, poi_charge: 9, agent_charge: 0, type: 'default', mt_charge: 0 }
      ],
      price: 15
    },
    {
      discounts: [
        { code: 1, discount: 16, poi_charge: 16, agent_charge: 0, type: 'default', mt_charge: 0 }
      ],
      price: 28
    },
    {
      discounts: [
        { code: 1, discount: 21, poi_charge: 21, agent_charge: 0, type: 'default', mt_charge: 0 }
      ],
      price: 42
    },
    {
      discounts: [
        { code: 1, discount: 25, poi_charge: 25, agent_charge: 0, type: 'default', mt_charge: 0 }
      ],
      price: 60
    },
    {
      discounts: [
        { code: 1, discount: 45, poi_charge: 45, agent_charge: 0, type: 'default', mt_charge: 0 }
      ],
      price: 100
    }
  ]
}
