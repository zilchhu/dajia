<template lang="pug">
.app
  .mdui-drawer(v-if="drawer_open")
    .mdui-list
      a.mdui-list-item(v-for="shop in shops" :key="shop.id" href="#") {{shop.poiName}}
  .container(ref="container")
</template>

<script>
  import Vue from 'vue'
  import flatten from 'flatten'

  import { Spreadsheet } from './codebase/spreadsheet.js'
  import './codebase/spreadsheet.css'
  import data from './assets/a.json'

  export default {
    data() {
      return {
        shops: [],
        foods: [],
        drawer_open: false
      }
    },
    mounted() {
      this.spreadsheet = new Spreadsheet(this.$refs.container, {
        editLine: true,
        toolbarBlocks: [
          'undo',
          'colors',
          'decoration',
          'align',
          'lock',
          'clear',
          'rows',
          'columns',
          'help',
          'format',
          'file'
        ],
        formats: [{ id: 'integer', name: 'integer', mask: '#' }]
      })
      this.spreadsheet.setStyle('A1', { background: '#F4D679' })

      this.fetchShops()
      this.fetchFoods()

      this.spreadsheet.parse(this.json2dhx(this.foods))
    },
    beforeDestroy: function () {
      this.spreadsheet.destructor()
    },
    methods: {
      json2dhx(data) {
        let body = data.map((row, row_index) =>
          row_index > 0 ? [...Object.values(row)] : [...Object.keys(row)]
        )

        let transed = body.map((row, row_index) =>
          row.map((col, col_index) => ({
            cell: pos2Cell([row_index, col_index]),
            value: col
          }))
        )

        function pos2Cell([i, j]) {
          const alphabeta = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          return `${alphabeta[j]}${i + 1}`
        }

        return flatten(transed)
      },
      fetchShops() {
        const shops = localStorage.getItem('shops')
        if (shops) {
          this.shops = JSON.parse(shops)
          return
        } else {
          fetch('http://localhost:8000/pois')
            .then(res => res.json())
            .then(res => res.dataList)
            .then(shops => {
              this.shops = shops
              localStorage.setItem('shops', JSON.stringify(shops))
            })
            .catch(err => console.error(err))
        }
      },
      fetchFoods() {
        const foods = localStorage.getItem('foods')
        if (foods) {
          this.foods = JSON.parse(foods)
          return
        } else {
          fetch('http://localhost:8000/poi/9776028/foods')
            .then(res => res.json())
            .then(foods => {
              this.foods = foods
              localStorage.setItem('foods', JSON.stringify(foods))
            })
            .catch(err => console.error(err))
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    width: 100vw
    height: 100vh
</style>
