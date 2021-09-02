import knx from '../50/index.js'
import { readXls, readJson } from './fallback/fallback_app.js'

async function t() {
  try {
    // const r = await knx('foxx_operating_data')
    //   .select()
    //   .where({ date: 20210306 })
    // const d = Array.from(new Set(r.map(v => v.shop_name))).map(v => r.find(k => k.shop_name == v))
    // await knx('foxx_operating_data')
    //   .where({ date: 20210306 })
    //   .del()
    // // console.log(d)
    // console.log(await knx('foxx_operating_data').insert(d))
    // const r = await knx('foxx_operating_data').select()
    // let cnt = r.length
    // for (let r0 of r) {
    //   console.log(cnt)
    //   try {
    //     await knx('test_analyse_t_')
    //       .where({ shop_name: r0.shop_name, date: r0.date, platform: r0.platform })
    //       .update({ unit_price: r0.unit_price })
    //   } catch (e) {
    //     console.error(e)
    //   }
    //   cnt -= 1
    // }
    // let data = await knx('foxx_real_shop_info').select()
    // let i = 0
    // for (let row of data) {
    //   let res = await knx('test_analyse_t_')
    //     .where({ shop_id: row.shop_id, platform: row.platform == 1 ? '美团' : '饿了么' })
    //     .update({ real_shop: row.real_shop_name })
    //   console.log(res, i)
    //   i += 1
    // }

    // let c = await readXls('plan/test_analyse_t_.xlsx', 'test_analyse_t_')
    // for (let row of c) {
    //   console.log(
    //     await knx('test_analyse_t_')
    //       .where({ shop_id: row.shop_id, date: row.date })
    //       .update({ a: row.a })
    //   )
    // }


    // let c = await readXls('plan/门店各项成本-5月统计表.xlsx', 'Sheet1')
    // for (let row of c) {
    //   const { 人均工资, 人数, 员工住宿, 水电, 铺租 } = row

    //   let update = {}
    //   if (水电 && 水电 != '') update = { ...update, water_electr: 水电 }
    //   if (员工住宿 && 员工住宿 != '') update = { ...update, staff_accom: 员工住宿 }
    //   if (人数 && 人数 != '') update = { ...update, staff_cnt: 人数 }
    //   if (人均工资 && 人均工资 != '') update = { ...update, employee_wage: 人均工资 }
    //   if (铺租 && 铺租 != '') update = { ...update, rent: 铺租 }

    //   if (Object.keys(update).length > 0)
    //     console.log(
    //       await knx('foxx_real_shop_info')
    //         .where({ real_shop_name: row.城市物理店 })
    //         .update(update)
    //     )
    //   console.log(row)
    // }

    let c = await readXls('plan/c4.xlsx', 'c4')
    let uniq_real_shop_names = Array.from(new Set(c.map(v => v.real_shop_name)))
    let real_shop_groups = uniq_real_shop_names
      .map(name => ({ real_shop_name: name, members: c.filter(v => v.real_shop_name == name) }))
      .map(g => ({
        ...g, member_cnt: g.members.length,
        has_gc: g.members.find(v => v.shop_name.includes('贡茶')) ? true : false,
        has_tp: g.members.find(v => v.shop_name.includes('甜品')) ? true : false
      }))
      .map(g => ({
        ...g,
        brand_cnt: g.has_gc && g.has_tp ? 2 : 1
      }))

    for (let group of real_shop_groups) {
      console.log(group.real_shop_name)
      console.log(
        await knx('foxx_real_shop_info')
          .where({ real_shop_name: group.real_shop_name })
          .update({ estimate_staff_cnt: group.brand_cnt == 2 ? 5 : 3 })
      )
    }
    // console.log(real_shop_groups)

  } catch (e) {
    console.error(e)
  }
}

t()