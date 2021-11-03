import { transform } from 'babel-standalone'

console.log(transform(`function A(){return <div></div>}`, { presets: ["react"] })) 