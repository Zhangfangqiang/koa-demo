const Router    = require("@koa/router")                          //路由
const router    = new Router({prefix: '/web/index'})              //实例化定义前戳
const UserModel = require('../../models/user-model')              //模型
const { Op }    = require("sequelize");                           //op应该是运算符号
/**
 * 返回视图和变量的方法
 */
router.get('/index', async (ctx, next) => {
  await ctx.render('web/index/index', {
    title : '你好',
    arr   : [1, 2, 3],
    now   : new Date()
  })
})

/**
 * 创建数据的方法
 */
router.get('/create', async (ctx, next) => {
  const jane = await UserModel.create({
    name       : "Jan234123e",
    avatar_url : 'use11ra123vatarUrl',
    open_id    : 'userope1123nId',
    nick_name  : "ni123ckan"
  });
  console.log(jane)
  ctx.body ='创建数据成功'
})

/**
 * 查询案例0
 */
router.get('/findAll0',async(ctx,next)=>{
  const users = await UserModel.findAll({
    where: {
      id        : {[Op.eq]: 2},
      nick_name : 'nickan'
    }
  })
  ctx.body    = users;
})

/**
 * 查询案例1
 */
router.get('/findAll1',async(ctx,next)=>{
  const users = await UserModel.findAll({
    where: {
      [Op.or]: [
        { id: 2 },
        { nick_name: 'ni123ckan' }
      ]
    }
  })
  ctx.body    = users;
})

/**
 * 查询案例2
 */
router.get('/findAll2',async(ctx,next)=>{
  const users = await UserModel.findAll({
    where: {
      id: {
        [Op.or]: [2, 3]
      }
    }
  })
  ctx.body    = users;
})

/**
 * 查询案例3
 */
router.get('/findAll3', async (ctx, next) => {
  const users = await UserModel.findAll({
    where: {
      [Op.and]: [
        {id        : '2'},
        {nick_name : 'nickan'}
      ]
    }
  })
  ctx.body = users;
})

/**
 * 更新
 */
router.get('/update', async (ctx, next) => {
  const users = await UserModel.update({
    nick_name: "傻逼"
  }, {
    where: {
      id: '1'
    }
  })
  ctx.body = users;
})

/**
 * 删除
 */
router.get('/destroy', async (ctx, next) => {
  const users = await UserModel.destroy({
    where: {
      id: '1'
    }
  })
  ctx.body = users;
})

module.exports = router