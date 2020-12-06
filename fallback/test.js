import App from '../index.js'
import FallbackApp from './fallback_app.js'
import fs from 'fs'

const app = new FallbackApp('9470231')

async function test() {
  try {
    
    const foods = await app.food.search('招牌烧仙草【墙裂推荐】')
    console.log(foods)
    
  } catch (error) {
    console.error(error)
  }
}



test()
