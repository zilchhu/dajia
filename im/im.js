import instance, {urls} from '../base/index.js'

export default class Im {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }
  async getConnectionToken() {
    return instance.post(urls.IM.getConnectionToken, {})
  }

  async getPoiIMStatus() {
    let data = {
      app_poi_code: this.appPoiCode
    }
    return instance.post(urls.IM.getPoiIMStatus, data)
  }
}