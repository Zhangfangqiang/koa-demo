const Router          = require("@koa/router")                         //路由
const router          = new Router({prefix: '/api/cart'})              //实例化定义前戳
const middleware      = require('./middleware');middleware(router)
const GoodsCartsModel = require('../../models/goods-carts-model')
const db              = require('../../models/db-mysql')

/**
 * 创建购物车
 */
router.post("/index", async (ctx) => {
  let res
  let { user_id: user_id }                       = ctx.user
  let { goods_id, goods_sku_id, goods_sku_desc } = ctx.request.body
  let num                                        = 1

  console.log(ctx.request.body)
  /*查询购物车是否存在该商品*/
  let hasExistRes = await GoodsCartsModel.findOne({where: {user_id, goods_id, goods_sku_id}})

  /*如果存在*/
  if (hasExistRes) {
    res = await GoodsCartsModel.update({num: hasExistRes.num + 1}, {where: {user_id, goods_id, goods_sku_id,}})
  } else {
    res = await GoodsCartsModel.create({user_id, goods_id, goods_sku_id, goods_sku_desc, num})
  }

  ctx.status = 200
  ctx.body   = {code: 200, msg: res ? 'ok' : '', data: res}
})

/**
 * 我的购物车
 */
router.get("/my", async (ctx) => {
  let { user_id: user_id } = ctx.user

  let res = await db.query(`SELECT (select d.content from goods_info as d where d.goods_id = a.goods_id and d.kind = 0 limit 1) as goods_image,
  a.id,a.goods_sku_id,a.goods_id,a.num,b.goods_sku_desc,b.goods_attr_path,b.price,b.stock,c.goods_name,c.goods_desc 
  FROM goods_carts as a 
  left outer join goods_sku as b on a.goods_sku_id = b.id 
  left outer join goods as c on a.goods_id = c.id 
  where a.user_id = :user_id;`, { replacements: { user_id }, type: db.QueryTypes.SELECT })

  // 使用循环查询找到匹配的规格
  if (res) {
    for (let j = 0; j < res.length; j++) {
      let item            = res[j]
      let goods_attr_path = item.goods_attr_path
      let attr_values     = await db.query("select id,attr_value from goods_attr_value where find_in_set(id,:attr_value_ids)", { replacements: { attr_value_ids: goods_attr_path.join(',') }, type: db.QueryTypes.SELECT })
      item.attr_values    = attr_values
      item.sku_desc       = goods_attr_path.map(attr_value_id => {
        return attr_values.find(item => item.id == attr_value_id).attr_value
      }).join(' ')
    }
  }

  ctx.status = 200
  ctx.body   = {code: 200, msg: 'ok', data: res}
})

/**
 * 修改我的购物车
 */
router.put("/my/:id", async (ctx) => {
  let id          = Number(ctx.params.id)
  let { num }     = ctx.request.body
  let hasExistRes = await GoodsCartsModel.findOne({where: {id}})

  if (!hasExistRes) {
    ctx.status      = 200
    ctx.body        = {code: 200, msg: '', data: ''}
  }

  hasExistRes.num = num
  let res    = await hasExistRes.save();
  ctx.status      = 200
  ctx.body        = {code: 200, msg: 'ok', data: res}
})

/**
 * 删除数据
 */
router.delete("/my", async (ctx) => {

  let { ids } = ctx.request.body
  let res     = await GoodsCartsModel.destroy({where: {id: ids}})      // desctroy返回的不是数据，而是成功删除的数目

  ctx.status = 200
  ctx.body   = {code: 200, msg: res > 0 ? 'ok' : '', data: res}
})


module.exports = router
