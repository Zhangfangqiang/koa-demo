const Router        = require("@koa/router")
const router        = new Router({prefix: '/api/category'})              //实例化定义前戳
const CategoryModel = require("../../models/category-model")

/**
 * 分类列表
 */
router.get("/index", async function(ctx){
  let categories = await CategoryModel.findAll({
    attributes: ["id", "category_name"]
  })
  ctx.status     = 200
  ctx.body       = {code: 200, msg: 'ok', data: categories}
})

module.exports = router