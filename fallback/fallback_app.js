import Food from './food.js'
import Act from './act.js'

export default class FallbackApp {
  constructor(wmPoiId) {
    this.food = new Food(wmPoiId)
    this.act = new Act(wmPoiId)
  }
}