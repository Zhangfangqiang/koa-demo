const Router              = require("@koa/router")
const router              = new Router({prefix: '/api/goods'})
const GoodsModel          = require("../../models/goods-model")
const GoodsSkuModel       = require("../../models/goods-sku-model")
const GoodsInfoModel      = require("../../models/goods-info-model")
const GoodsAttrKeyModel   = require("../../models/goods-attr-key-model")
const GoodsAttrValueModel = require("../../models/goods-attr-value-model")

/**
 * 商品列表
 */
router.get("/index", async function(ctx){
  let whereObj   = {}
  let page_size  = 20
  let page_index = 1

  if (ctx.query.page_size) {
    page_size = Number(ctx.query.page_size)
  }
  if (ctx.query.page_index) {
    page_index = Number(ctx.query.page_index)
  }
  if (ctx.query.category_id) {
    whereObj['category_id'] = Number(ctx.query.category_id)
  }

  GoodsModel.hasMany(GoodsInfoModel, {foreignKey: 'goods_id', targetKey: 'id'});

  let goods = await GoodsModel.findAndCountAll({
    where  : whereObj,
    order  : [['id', 'desc']],
    limit  : page_size,
    offset : (page_index - 1) * page_size,
    include: [{
      model     : GoodsInfoModel,
      attributes: ['content', 'kind', 'goods_id','picture'],
      where     : {'kind': 1}
    }],
    distinct: true
  })

  ctx.status = 200
  ctx.body   = {code: 200, msg: 'ok', data: goods}
})

/**
 * 商品详情
 */
router.get("/:id", async (ctx) => {
  GoodsModel.hasMany(GoodsInfoModel, {foreignKey: 'goods_id', targetKey: 'id'});

  let goods = await GoodsModel.findOne({
    where:{
      id:Number(ctx.params.id)
    },
    include: [{
      model: GoodsInfoModel,
      attributes: ['content', 'kind', 'goods_id','picture']
    }],
  })

  ctx.status = 200
  ctx.body   = {code: 200, msg: 'ok', data: goods}
})

/**
 * 商品详情加sku
 */
router.get("/:id/sku", async (ctx) => {
  GoodsAttrKeyModel.hasMany(GoodsAttrValueModel, {foreignKey: 'attr_key_id', targetKey: 'id'});

  let goodsId       = Number(ctx.params.id)
  let goodsSku      = await GoodsSkuModel.findAll({
    where: {
      goods_id: goodsId
    }
  })
  let goodsAttrKeys = await GoodsAttrKeyModel.findAll({
    where: {
      goods_id: goodsId
    },
    attributes: ['id', 'attr_key', 'goods_id'],
    include: [{
      model: GoodsAttrValueModel,
      attributes: ['id', 'attr_value', 'attr_key_id', 'goods_id']
    }],
    distinct: true
  })

  ctx.status = 200
  ctx.body   = {code: 200, msg: 'ok', data: {goodsSku,goodsAttrKeys}}
})

module.exports = router