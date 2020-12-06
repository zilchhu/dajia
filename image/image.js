import instance, { urls } from '../base/index.js'

export default class Image {
  constructor(appPoiCode) {
    this.appPoiCode = appPoiCode
  }

  async upload(imgName, imgData) {
    let data = {
      app_poi_code: this.appPoiCode,
      img_name: imgName,
      img_data: imgData
    }
    return instance.post(urls.image.upload, data)
  }
}
