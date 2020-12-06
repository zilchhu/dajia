import Food from './food/food.js'
import FoodCat from './food/foodCat.js'
import FoodDna from './food/foodDna.js'
import Image from './image/image.js'
import Order from './order/order.js'
import Poi from './poi/poi.js'
import Act from './act/act.js'
import Im from './im/im.js'

// 13377640599
// 18718480686
// 1qaz!QAZ..
// 8.135.44.223
const appPoiCode = 't_fLkr2jOW5A'

export default class App {
  constructor(appPoiCode) {
    this.food = new Food(appPoiCode)
    this.foodCat = new FoodCat(appPoiCode)
    this.foodDna = new FoodDna(appPoiCode)
    this.image = new Image(appPoiCode)
    this.order = new Order(appPoiCode)
    this.poi = new Poi(appPoiCode)
    this.act = new Act(appPoiCode)
    this.im = new Im(appPoiCode)
  }
}


