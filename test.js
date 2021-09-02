const 美团成本问题 = (id, date) => `SET @date = ${date};
    SET @shop_id = ${id};

    WITH
    a AS (
      SELECT 
        wmpoiid,
        F_GET_SHOP_NAME(wmPoiid) shop_name,
        wm_order_id_view_str order_id,
        details,
        settleAmount,
        goods_count,
        cost_sum,
      CASE
      WHEN goods_count BETWEEN 1 AND 3 THEN
        goods_count
      WHEN goods_count < 1 THEN
        0
      ELSE
        4
      END goods_cnt
      FROM foxx_order_manag_historical
      WHERE
        date = @date
    -- 		填写id
        AND wmpoiid = @shop_id	
        AND ( 
          cancel_reason = '' OR
          cancel_reason IS NULL
        )
    ),
    c AS (
      SELECT 
        order_id,
        CASE 
        WHEN activi_info LIKE '%现价%' THEN
          '折扣'
        ELSE
          '满减'
        END activi
      FROM foox_order_his 
      WHERE 
        date = DATE_FORMAT( DATE_SUB( @date, INTERVAL 1 DAY ), "%Y%m%d" )
    -- 		填写id
        AND shop_id = @shop_id
    ),
    b AS (
      SELECT 
        wmpoiid,
        shop_name,
        goods_cnt,
        activi,
    -- 		a.order_id,
        SUM(cost_sum) cost,
        SUM(settleAmount) settlea,
        count(*) order_cnt
      FROM a JOIN c ON a.order_id = c.order_id
      GROUP BY goods_cnt, activi
    )
    SELECT 
      wmpoiid,
      shop_name,
      goods_cnt '商品数',
      activi '活动',
      cost '成本',
      settlea '收入',
      order_cnt '单量',
      order_cnt / SUM(order_cnt) OVER() AS '单量占比',
      cost / settlea AS '成本比例'
    FROM b
    ORDER BY activi, goods_cnt`

const 饿了么成本问题 = (id, date) => `SET @date = ${date};
    SET @shop_id = ${id};

    WITH a AS (
      SELECT
        shop_id,
        shop_name,
        order_id,
        order_detail,
        CASE
        WHEN goods_count BETWEEN 1 AND 3 THEN
          goods_count
        WHEN goods_count < 1 THEN
          0
        ELSE
          4
        END goods_cnt,
        cost_sum
      FROM
        ele_order_manag 
      WHERE
    -- 	输入门店id
        shop_id = @shop_id AND
        insert_date BETWEEN @date AND DATE_ADD( @date, INTERVAL 1 DAY )
    ),
    b AS ( 
    SELECT 
      order_id, 
      income,
      CASE
        WHEN activities_fee LIKE '%特价%' THEN
          '折扣'
        ELSE
          '满减'
      END act
    FROM ele_order_manag_add WHERE insert_date BETWEEN @date AND DATE_ADD( @date, INTERVAL 1 DAY )
    ),
    c AS (
    -- 加入第三方配送费
      SELECT
        shop_id,
        third_send / orders AS third_send 
      FROM
        foxx_operating_data 
      WHERE
        date = DATE_SUB( @date, INTERVAL 1 DAY ) 
        AND platform = '饿了么'
    ),
    d AS (
      SELECT 
        a.shop_id,
        a.shop_name, 
        b.act 活动, 
        a.goods_cnt 商品数,
        count(*) OVER(PARTITION BY act, goods_cnt) 单量,
        count(*) OVER(PARTITION BY act, goods_cnt) / count(*) OVER() 单量占比,
        SUM(cost_sum) OVER(PARTITION BY act, goods_cnt) 成本, 
        SUM(income - third_send) OVER(PARTITION BY act, goods_cnt) 收入,
        third_send 单均配送,
        SUM(cost_sum) OVER(PARTITION BY act, goods_cnt) / SUM(income - third_send) OVER(PARTITION BY act, goods_cnt) 成本比例
      FROM 
      a 
        JOIN b 
          ON a.order_id = b.order_id 
        JOIN c 
          ON a.shop_id = c.shop_id
    )
    SELECT * FROM d GROUP BY 活动, 商品数`

const 美团单维度订单 = (id, activi, counts, date) => `SET @date = ${date};
    SET @shop_id = ${id};

    WITH
    a AS (
      SELECT 
        wmpoiid,
        F_GET_SHOP_NAME(wmPoiid) shop_name,
        wm_order_id_view_str order_id,
        details,
        settleAmount,
        CASE
        WHEN goods_count BETWEEN 1 AND 3 THEN
          goods_count
        WHEN goods_count < 1 THEN
          0
        ELSE
          4
        END goods_count,
          cost_sum
      FROM foxx_order_manag_historical
      WHERE
        date = @date
        AND wmpoiid = @shop_id
        AND ( 
          cancel_reason = '' OR
          cancel_reason IS NULL
        )
    ),
    c AS (
      SELECT 
        order_id, 
        CASE 
        WHEN activi_info LIKE '%现价%' THEN
          '折扣'
        ELSE
          '满减'
        END activi
      FROM foox_order_his WHERE date = DATE_FORMAT( DATE_SUB( @date, INTERVAL 1 DAY ), "%Y%m%d" )
    ),
    b AS (
      SELECT 
        wmpoiid,
        shop_name,
        a.order_id 订单id,
        activi 活动,
        goods_count 商品数,
        details 订单信息,
        cost_sum 成本,
        settleAmount 收入,
        cost_sum / settleAmount 成本比例
      FROM a JOIN c ON a.order_id = c.order_id
    )
    SELECT * FROM b 
    WHERE 
      活动 = '${activi}' AND
      商品数 = ${counts}
    ORDER BY 成本比例 DESC`

const 饿了么维度订单 = (id, activi, counts, date) => `SET @date = ${date};
SET @shop_id = ${id};

WITH a AS (
	SELECT
		shop_id,
		shop_name,
		order_id,
		order_detail,
		CASE
		WHEN goods_count BETWEEN 1 AND 3 THEN
			goods_count
		WHEN goods_count < 1 THEN
			0
		ELSE
			4
		END goods_cnt,
		cost_sum
	FROM
		ele_order_manag 
	WHERE
	  shop_id = @shop_id AND
		insert_date BETWEEN @date AND DATE_ADD( @date, INTERVAL 1 DAY )
),
b AS ( 
SELECT 
	order_id, 
	income,
	CASE
		WHEN activities_fee LIKE '%特价%' THEN
			'折扣'
		ELSE
			'满减'
	END act
FROM ele_order_manag_add WHERE insert_date BETWEEN @date AND DATE_ADD( @date, INTERVAL 1 DAY )
),
c AS (
-- 加入第三方配送费
	SELECT
		shop_id,
		third_send / orders AS third_send 
	FROM
		foxx_operating_data 
	WHERE
		date = DATE_SUB( @date, INTERVAL 1 DAY ) 
		AND platform = '饿了么'
)
SELECT 
	a.shop_id,
	a.shop_name, 
	b.act 活动,
	a.goods_cnt 商品数,
	a.order_id 订单id,
	a.order_detail 订单信息,
	b.income 收入,
	a.cost_sum 成本,
	c.third_send 单均配送,
	a.cost_sum / (b.income - c.third_send) 成本比例
FROM a
	JOIN b 
		ON a.order_id = b.order_id 
	JOIN c 
		ON a.shop_id = c.shop_id
WHERE 
	act = '${activi}' AND
	goods_cnt = ${counts}
ORDER BY 成本比例 DESC`