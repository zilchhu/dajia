import Food from './food.js'

export default class App {
  constructor(wmPoiId, cookie) {
    this.food = new Food(wmPoiId, cookie)
  }
}