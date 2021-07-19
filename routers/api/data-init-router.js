const Router              = require("@koa/router")                              //路由
const router              = new Router({prefix: '/api/data-init'})              //实例化定义前戳
const casual              = require('casual');
const CategoryModel       = require('../../models/category-model')
const BrandModel          = require('../../models/brand-model')
const GoodsModel          = require('../../models/goods-model')
const GoodsInfoModel      = require('../../models/goods-info-model')
const GoodsAttrKeyModel   = require('../../models/goods-attr-key-model')
const GoodsAttrValueModel = require('../../models/goods-attr-value-model')
const GoodsSkuModel       = require('../../models/goods-sku-model')
const common              = require('../../lib/common')

/**
 * 初始化数据
 */
router.get('/index', async (ctx, next) => {
  /**
   * 创建分类
   */
  await CategoryModel.bulkCreate([
    {category_name: "生活方式"},
    {category_name: "文创好物"},
    {category_name: "创意玩具"},
    {category_name: "微瑕特卖"},
    {category_name: "宫廷服饰"},
    {category_name: "甄选珠宝"},
    {category_name: "宫廷美玉"}
  ])

  /**
   * 品牌创建
   */
  await BrandModel.bulkCreate([
    {brand_name: "故宫文化"},
    {brand_name: "朝阳国贸CBD"},
    {brand_name: "西单购物广场"}
  ])

  /**
   * 添加商品
   */
  let goodsArr = [];
  casual.define('goods', function() {
    return {
      spu_no      : casual.uuid,
      goods_name  : casual.title,
      goods_desc  : casual.description,
      start_price : casual.integer(1, 999999),
      category_id : casual.integer(1, 7),
      brand_id    : casual.integer(1, 3)
    };
  });
  for (var i = 0; i < 90; ++i) {
    goodsArr.push(casual.goods);
  }
  await GoodsModel.bulkCreate(goodsArr)
  let goods = await GoodsModel.findAll()

  /**
   * 初始化商品描述
   */
  let goodsInfoArr = []
  goods.forEach((value, key) => {
    for (let i = 0; i < 4; i++) {
      goodsInfoArr.push({
        goods_id: value.id,
        kind: casual.integer(1, 4),
        content: casual.description,
        picture: casual.random_element(['https://www.zfajax.com/wp-content/uploads/2021/07/O1CN01zoxGfF1CyHhWTWUOt_0-item_pic.jpg_460x460Q90.jpg_.jpg','https://www.zfajax.com/wp-content/uploads/2021/07/O1CN01aMsYKT25KiJTdcLuX_0-item_pic.jpg_460x460Q90.jpg_.jpg'])
      })
    }
  })
  await GoodsInfoModel.bulkCreate(goodsInfoArr)

  /**
   * 初始化商品key
   * @type {*[]}
   */
  let goodsAttrKeyArr =[]
  goods.forEach((value, key) => {
    //每个商品创建两个key
    for (let i = 0; i < 2; i++) {
      goodsAttrKeyArr.push({
        goods_id: value.id,
        attr_key: casual.title
      })
    }
  })
  await GoodsAttrKeyModel.bulkCreate(goodsAttrKeyArr)
  let goodsAttrKey = await GoodsAttrKeyModel.findAll()

  /**
   * 初始化商品value
   */
  let goodsAttrValueArr = []
  goodsAttrKey.forEach((value, key) => {
    for (let i = 0; i < 4; i++) {
      goodsAttrValueArr.push({
        goods_id    : value.goods_id,
        attr_key_id : value.id,
        attr_value  : casual.title
      })
    }
  })
  await GoodsAttrValueModel.bulkCreate(goodsAttrValueArr)

  /**
   * 初始化商品suk表
   */
  GoodsAttrKeyModel.hasMany(GoodsAttrValueModel, {foreignKey: 'attr_key_id', targetKey: 'id'});
  goods.forEach(async (value, key) => {
    let goodsSku      = [];
    let goodsAttrKeys = await GoodsAttrKeyModel.findAll({
      where: {
        goods_id: value.id
      },
      attributes: ['id', 'attr_key', 'goods_id'],
      include: [{
        model: GoodsAttrValueModel,
        attributes: ['id', 'attr_value', 'attr_key_id', 'goods_id']
      }],
      distinct: true
    })
    let doExs = []
    for (let i = 0; i < goodsAttrKeys.length; i++) {
      let doEx = []
      for (let j = 0; j < goodsAttrKeys[i].goods_attr_values.length; j++) {
        doEx.push(goodsAttrKeys[i].goods_attr_values[j].id)
      }
      doExs.push(doEx)
    }

    let doExchange = common.doExchange(doExs)
    doExchange.forEach((v, k) => {
      goodsSku.push({
        goods_id        : value.id,
        goods_attr_path : v,
        goods_sku_desc  : casual.description,
        price           : casual.integer(100, 999999),
        stock           : casual.integer(100, 1000)
      })
    })

    GoodsSkuModel.bulkCreate(goodsSku)
  })

  ctx.body = '成功'
})


/**
 * 作为一个模块抛出
 * @type {any}
 */
module.exports = router