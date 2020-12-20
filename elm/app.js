import Food from './food.js'

export default class App {
  constructor(shopId) {
    this.food = new Food(shopId)
  }
}