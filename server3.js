import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'

import knex from 'knex'
const knx = knex({
  client: 'mysql',
  connection: {
    host: '192.168.3.112',
    user: 'root',
    password: '123456',
    database: 'naicai'
  }
})

const koa = new Koa()
const router = new Router()

koa.use(cors())
koa.use(
  bodyParser({
    onerror: function(err, ctx) {
      ctx.throw('body parse error', 422)
    }
  })
)

router.get('/yt', async ctx => {
  try {
    const data = await ytTableData()
    ctx.body = { err: null, data }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})

router.get('/jx', async ctx => {
  try {
    const data = await jxTableData()
    ctx.body = { err: null, data }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})

router.get('/all', async ctx => {
  try {
    const data = await allData()
    ctx.body = { err: null, data }
  } catch (err) {
    console.error(err)
    ctx.body = { err, data: null }
  }
})

koa.use(router.routes())

koa.listen(9002, () => console.log('running at 9002'))

// ========================================================

async function ytTableData() {
  try {
    const [yt, _] = await knx.raw(sqlYt(1, '万科'))
    return yt
  } catch (err) {
    return Promise.reject(err)
  }
}

async function jxTableData() {
  try {
    const [jx, _] = await knx.raw(sql_jx)
    return jx
  } catch (err) {
    return Promise.reject(err)
  }
}

async function allData() {
  try {
    const [yt, _] = await knx.raw(sql_yt)
    const [jx, __] = await knx.raw(sql_jx)

    if (!yt || !jx) return []

    const all = yt.map(y => ({
      ...y,
      ...jx.find(j => j.物理店 == y.物理店)
    }))
    return all
  } catch (err) {
    return Promise.reject(err)
  }
}

// 收入(实收) settlea - third_send
// 推广费比例 promotion_rate
// 物理店营业额 sum(收入) by real_shop
// 物理店单店平均收入 avg(收入) by real_shop
// 物理店推广费比例
// 成本比例
// 当日收入与30日平均收入比值

function sqlJx(day, realShop) {
  let sql_jx = `WITH 
	a AS (
		SELECT
			real_shop,
		-- 	物理店总收入
			SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) sum_settlea,
			SUM(consume) OVER(PARTITION BY real_shop,date) sum_consume,
			SUM(price) OVER(PARTITION BY real_shop,date) sum_price,
		-- 	物理店单平台收入
			AVG(settlea - third_send) OVER(PARTITION BY real_shop,date) avg_settlea,
		-- 	物理店推广费比例
			SUM(consume) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) consume_percent,
		-- 	物理店成本比例
			SUM(price) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) price_percent,
		-- 	营业额分数
			CASE
				WHEN AVG(settlea - third_send) OVER(PARTITION BY real_shop,date) > 2500 THEN
					50
				ELSE
					AVG(settlea - third_send) OVER(PARTITION BY real_shop,date) / 50 
			END score1,
	-- 		推广分数
			CASE
				WHEN SUM(consume) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) > 0.065 THEN
					0
				WHEN SUM(consume) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) < 0.04 THEN
					15
				ELSE
					(0.065 - SUM(consume) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date)) * 600 
			END score2,
	-- 	成本分数
			CASE
				WHEN SUM(price) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) > 0.54 THEN
					0
				WHEN SUM(price) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) < 0.44 THEN
					35
				ELSE
					(0.54 - SUM(price) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date)) * 350
				END	score3,
			date
		FROM 
			foxx_operating_data 
		WHERE
			price <> 0
			AND CURDATE() - ${day} <= DATE_ADD(date,INTERVAL 2 day) and  DATE_ADD(date,INTERVAL 2 day) < CURDATE()
	),
	b AS (
		SELECT
			city,
			person,
			real_shop_name
		FROM
			foxx_real_shop_info
		WHERE
			is_delete = 0
		GROUP BY
			real_shop_name
	),
	c AS(
		SELECT
			b.city,
			b.person,
			b.real_shop_name,
			a.sum_settlea,
			a.sum_consume,
			a.sum_price,
			a.avg_settlea,
			a.consume_percent,
			a.price_percent,
			a.score1,
			a.score2,
			a.score3,
			score1 + score2 + score3 AS score,
			AVG(score1 + score2 + score3) OVER(PARTITION BY person, date) AS avg_score,
			a.date
		FROM
		 a JOIN b ON a.real_shop = b.real_shop_name
		GROUP BY
			a.date,
			b.real_shop_name
	),
	d AS (
		SELECT
		city,
		person,
		real_shop_name,
		sum_settlea,
		sum_consume,
		sum_price,
		SUM(sum_price) OVER(PARTITION BY person,date) / SUM(sum_settlea) OVER(PARTITION BY person,date) AS p_price,
		SUM(sum_consume) OVER(PARTITION BY person,date) / SUM(sum_settlea) OVER(PARTITION BY person,date) AS p_consume,
		avg_settlea,
		consume_percent,
		price_percent,
		score1,
		score2,
		score3,
		score,
		score - LEAD(score, 1) OVER(PARTITION BY real_shop_name ORDER BY date DESC) AS chgScore,
		avg_score,
		avg_score - LEAD(avg_score, 1) OVER(PARTITION BY real_shop_name ORDER BY date DESC) AS chgAvgScore,
		date
	FROM
	 c
	)
	SELECT
		city AS '城市',
		person AS '运营',
		real_shop_name AS '物理店',
		sum_settlea AS '物理店收入',
		sum_price AS '物理店成本',
		sum_consume AS '物理店推广费',
		avg_settlea AS '物理店单店平均收入',
		consume_percent AS '物理店推广费比例',
		price_percent AS '物理店成本比例',
		score1 AS '营业额加分',
		score2 AS '推广加分',
		score3 AS '成本加分',
		score AS '分数',
		chgScore AS '分数变化',
		p_price AS '总成本比例',
		p_consume AS '总推广比例',
		avg_score AS '平均分',
		chgAvgScore AS '平均分变化',
		date AS '日期'
	FROM
	 d
	WHERE
		DATE_ADD(date,INTERVAL 1 DAY) = CURRENT_DATE - ${day} and real_shop_name = '${realShop}'
	ORDER BY 
		 person,
		score`
  return sql_jx
}

let sql_jx = `WITH 
a AS (
	SELECT
		real_shop,
	-- 	物理店总收入
		SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) sum_settlea,
		SUM(consume) OVER(PARTITION BY real_shop,date) sum_consume,
		SUM(price) OVER(PARTITION BY real_shop,date) sum_price,
	-- 	物理店单平台收入
		AVG(settlea - third_send) OVER(PARTITION BY real_shop,date) avg_settlea,
	-- 	物理店推广费比例
		SUM(consume) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) consume_percent,
	-- 	物理店成本比例
		SUM(price) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) price_percent,
	-- 	营业额分数
		CASE
			WHEN AVG(settlea - third_send) OVER(PARTITION BY real_shop,date) > 2500 THEN
				50
			ELSE
				AVG(settlea - third_send) OVER(PARTITION BY real_shop,date) / 50 
		END score1,
-- 		推广分数
		CASE
			WHEN SUM(consume) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) > 0.065 THEN
				0
			WHEN SUM(consume) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) < 0.04 THEN
				15
			ELSE
				(0.065 - SUM(consume) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date)) * 600 
		END score2,
-- 	成本分数
		CASE
			WHEN SUM(price) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) > 0.54 THEN
				0
			WHEN SUM(price) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date) < 0.44 THEN
				35
			ELSE
				(0.54 - SUM(price) OVER(PARTITION BY real_shop,date) / SUM(settlea - third_send) OVER(PARTITION BY real_shop,date)) * 350
			END	score3,
		date
	FROM 
		foxx_operating_data 
	WHERE
		price <> 0
		AND CURDATE() <= DATE_ADD(date,INTERVAL 2 day) 
),
b AS (
	SELECT
		city,
		person,
		real_shop_name
	FROM
		foxx_real_shop_info
	WHERE
		is_delete = 0
	GROUP BY
		real_shop_name
),
c AS(
	SELECT
		b.city,
		b.person,
		b.real_shop_name,
		a.sum_settlea,
		a.sum_consume,
		a.sum_price,
		a.avg_settlea,
		a.consume_percent,
		a.price_percent,
		a.score1,
		a.score2,
		a.score3,
		score1 + score2 + score3 AS score,
		AVG(score1 + score2 + score3) OVER(PARTITION BY person, date) AS avg_score,
		a.date
	FROM
	 a JOIN b ON a.real_shop = b.real_shop_name
	GROUP BY
		a.date,
		b.real_shop_name
),
d AS (
	SELECT
	city,
	person,
	real_shop_name,
	sum_settlea,
	sum_consume,
	sum_price,
	SUM(sum_price) OVER(PARTITION BY person,date) / SUM(sum_settlea) OVER(PARTITION BY person,date) AS p_price,
	SUM(sum_consume) OVER(PARTITION BY person,date) / SUM(sum_settlea) OVER(PARTITION BY person,date) AS p_consume,
	avg_settlea,
	consume_percent,
	price_percent,
	score1,
	score2,
	score3,
	score,
	score - LEAD(score, 1) OVER(PARTITION BY real_shop_name ORDER BY date DESC) AS chgScore,
	avg_score,
	avg_score - LEAD(avg_score, 1) OVER(PARTITION BY real_shop_name ORDER BY date DESC) AS chgAvgScore,
	date
FROM
 c
)
SELECT
	city AS '城市',
	person AS '运营',
	real_shop_name AS '物理店',
	sum_settlea AS '物理店收入',
	sum_price AS '物理店成本',
	sum_consume AS '物理店推广费',
	avg_settlea AS '物理店单店平均收入',
	consume_percent AS '物理店推广费比例',
	price_percent AS '物理店成本比例',
	score1 AS '营业额加分',
	score2 AS '推广加分',
	score3 AS '成本加分',
	score AS '分数',
	chgScore AS '分数变化',
	p_price AS '总成本比例',
	p_consume AS '总推广比例',
	avg_score AS '平均分',
	chgAvgScore AS '平均分变化',
	date AS '日期'
FROM
 d
WHERE
	DATE_ADD(date,INTERVAL 1 DAY) = CURRENT_DATE
ORDER BY 
	 person,
	score`

function sqlYt(day, shop) {
  let sql_yt = `WITH
a AS (
-- 生成营业推广表
	SELECT 
		real_shop,
		shop_id,
		shop_name,
		third_send,
		platform, 
		settlea - third_send AS settlea,
		consume,
		CONCAT(
			ROUND(promotion_rate * 100, 2), '%'
		) consume_percent,
		SUM(settlea - third_send) OVER(
			PARTITION BY real_shop
		) sum_settlea,
		SUM(consume) OVER(
			PARTITION BY real_shop
		) sum_consume, 
		CONCAT(
			-- 转换为%格式
			ROUND(
					(
			-- 物理店推广费比率
						SUM(consume) over(
							PARTITION BY
								real_shop
						) / 
						SUM(settlea - third_send) over(
							PARTITION BY
								real_shop
						)
					) * 100, 2
				), '%'
		) sum_consume_percent,
		price,
		CONCAT(ROUND(cost_ratio * 100, 2), '%') price_percent,
		orders, 
		unit_price,
		date
	FROM
		foxx_operating_data 
	WHERE
		CURDATE() - ${day} = DATE_ADD(date,INTERVAL 1 day)
),
b AS (
	SELECT
		shop_id,
		city,
		person
	FROM
		foxx_real_shop_info
	WHERE
		is_delete = 0
),
c AS (
	SELECT
		shop_id,
		settlea / AVG(settlea) OVER(
			PARTITION BY
				shop_id
		) AS settlea1,
		settlea / LEAD(settlea, 1, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) AS settlea2,
		settlea / LEAD(settlea, 7, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) AS settlea3,
		(settlea + LEAD(settlea, 1, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) + LEAD(settlea, 2, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		)) / (LEAD(settlea, 7, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) + LEAD(settlea, 8, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) + LEAD(settlea, 9, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		)) AS settlea4,
		date
	FROM 
		foxx_operating_data
	WHERE
		settlea > 0
		AND DATE_ADD(date,INTERVAL 31 DAY) >= CURRENT_DATE - ${day} and DATE_ADD(date,INTERVAL 31 DAY) < CURRENT_DATE
)
SELECT
	b.city,
	b.person,
	real_shop 物理店,
	a.shop_id 外卖店编号,
	shop_name 外卖店名,
	platform 平台, 
	settlea 收入, 
	consume 推广费,
	consume_percent 推广费比例,
	sum_settlea 物理店营业额,
	sum_consume 物理店营推广费, 
	sum_consume_percent 物理店推广费比例,
	price 成本,
	price_percent 成本比例,
	orders 有效订单, 
	unit_price 单价,
	settlea1 AS '当日收入与30日平均收入比值',
	CONCAT(ROUND(100 * (settlea2 - 1),2), '%') AS '当日收入比昨日环比增长',
	CONCAT(ROUND(100 * (settlea3 - 1),2), '%') AS '当日收入比上周环比增长（当日）',
	CONCAT(ROUND(100 * (settlea4 - 1),2), '%') AS '当日收入比上周环比增长（三日）',
	a.date
FROM
	a 
	JOIN b ON a.shop_id = b.shop_id
	LEFT JOIN c 
	ON DATE_ADD(c.date,INTERVAL 1 DAY) = CURRENT_DATE - ${day}
	AND a.shop_id = c.shop_id 
	AND a.date = c.date
WHERE settlea <> 0 and shop_name = '${shop}'
ORDER BY 
	platform,
	real_shop`
	console.log(sql_yt)
	return sql_yt
}

let sql_yt = `WITH
a AS (
-- 生成营业推广表
	SELECT 
		real_shop,
		shop_id,
		shop_name,
		third_send,
		platform, 
		settlea - third_send AS settlea,
		consume,
		CONCAT(
			ROUND(promotion_rate * 100, 2), '%'
		) consume_percent,
		SUM(settlea - third_send) OVER(
			PARTITION BY real_shop
		) sum_settlea,
		SUM(consume) OVER(
			PARTITION BY real_shop
		) sum_consume, 
		CONCAT(
			-- 转换为%格式
			ROUND(
					(
			-- 物理店推广费比率
						SUM(consume) over(
							PARTITION BY
								real_shop
						) / 
						SUM(settlea - third_send) over(
							PARTITION BY
								real_shop
						)
					) * 100, 2
				), '%'
		) sum_consume_percent,
		price,
		CONCAT(ROUND(cost_ratio * 100, 2), '%') price_percent,
		orders, 
		unit_price,
		date
	FROM
		foxx_operating_data 
	WHERE
		CURDATE() = DATE_ADD(date,INTERVAL 1 day)
),
b AS (
	SELECT
		shop_id,
		city,
		person
	FROM
		foxx_real_shop_info
	WHERE
		is_delete = 0
),
c AS (
	SELECT
		shop_id,
		settlea / AVG(settlea) OVER(
			PARTITION BY
				shop_id
		) AS settlea1,
		settlea / LEAD(settlea, 1, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) AS settlea2,
		settlea / LEAD(settlea, 7, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) AS settlea3,
		(settlea + LEAD(settlea, 1, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) + LEAD(settlea, 2, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		)) / (LEAD(settlea, 7, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) + LEAD(settlea, 8, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		) + LEAD(settlea, 9, 0) OVER(
			PARTITION BY 
				shop_id
			ORDER BY 
				date DESC
		)) AS settlea4,
		date
	FROM 
		foxx_operating_data
	WHERE
		settlea > 0
		AND DATE_ADD(date,INTERVAL 31 DAY) >= CURRENT_DATE 
)
SELECT
	b.city,
	b.person,
	real_shop 物理店,
	a.shop_id 外卖店编号,
	shop_name 外卖店名,
	platform 平台, 
	settlea 收入, 
	consume 推广费,
	consume_percent 推广费比例,
	sum_settlea 物理店营业额,
	sum_consume 物理店营推广费, 
	sum_consume_percent 物理店推广费比例,
	price 成本,
	price_percent 成本比例,
	orders 有效订单, 
	unit_price 单价,
	settlea1 AS '当日收入与30日平均收入比值',
	CONCAT(ROUND(100 * (settlea2 - 1),2), '%') AS '当日收入比昨日环比增长',
	CONCAT(ROUND(100 * (settlea3 - 1),2), '%') AS '当日收入比上周环比增长（当日）',
	CONCAT(ROUND(100 * (settlea4 - 1),2), '%') AS '当日收入比上周环比增长（三日）',
	a.date
FROM
	a 
	JOIN b ON a.shop_id = b.shop_id
	LEFT JOIN c 
	ON DATE_ADD(c.date,INTERVAL 1 DAY) = CURRENT_DATE
	AND a.shop_id = c.shop_id 
	AND a.date = c.date
WHERE settlea <> 0 
ORDER BY 
	platform,
	real_shop`
