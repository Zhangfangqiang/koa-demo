const Router          = require("@koa/router")                         //路由
const router          = new Router({prefix: '/api/user'})              //实例化定义前戳
const jsonwebtoken    = require('jsonwebtoken')                        //签发验证工具
const weapp           = require('../../config/weapp')                  //配置文件
const koajwt          = require('koa-jwt')                             //jsonWebToken
const WXBizDataCrypt  = require('../../lib/WXBizDataCrypt')            //解密用的
const WeixinAuth      = require("../../lib/koa2-weixin-auth")          //auth
const weixinAuth      = new WeixinAuth(weapp.miniProgram.appId, weapp.miniProgram.appSecret)
const UserModel       = require('../../models/user-model')
const SessionKeyModel = require('../../models/session-key-model')
const AddressModel    = require('../../models/address-model')
const util            = require('util');
const pay             = require('./pay')
const middleware      = require('./middleware');middleware(router)

/**
 * 路由中间件
 */
router.use(koajwt({secret: weapp.jwtSecret}).unless({
  path: ['/api/user/sign', '/api/user/verify', '/api/user/wexin-login0','/api/user/hi']
}))


/**
 * 签token
 */
router.get('/sign', (ctx, next) => {
  ctx.body = jsonwebtoken.sign({'user': '用户'},  weapp.jwtSecret)
})

/**
 * 验token
 */
router.get('/verify', (ctx, next) => {
  ctx.body = jsonwebtoken.verify(ctx.request.query.token,  weapp.jwtSecret)
})

/**
 * 用户中心
 */
router.get('/index', (ctx, next) => {
  ctx.body = '成功'
})

/**
 * 根据微信小程序返回的数据进行登陆
 */
router.post("/wexin-login0", async (ctx) => {
  let sessionKey
  let {code, userInfo, encryptedData, iv, sessionKeyIsValid} = ctx.request.body

  /**
   * 如果客户端有sessionKeyIsValid(token)则传来，解析
   */
  if (sessionKeyIsValid) {
    let token = ctx.request.header.authorization
    token = token.split(' ')[1]
    // token有可能是空的
    if (token) {
      let payload = await util.promisify(jsonwebtoken.verify)(token, weapp.jwtSecret).catch(err => {})    //验证token是否正确
      if (payload){ sessionKey = payload.sessionKey}
    }
  }

  /**
   * 除了尝试从token中获取sessionKey，还可以从数据库中或服务器redis缓存中获取
   * 如果在db或redis中存储，可以与cookie结合起来使用，
   * 目前没有这样做，sessionKey仍然存在丢失的时候，又缺少一个wx.clearSession方法
   */
  if (sessionKeyIsValid && !sessionKey && ctx.session.sessionKeyRecordId) {
    let sessionKeyRecordId = ctx.session.sessionKeyRecordId
    // 如果还不有找到历史上有效的sessionKey，从db中取一下
    let sesskonKeyRecordOld = await SessionKeyModel.findOne({
      where: {id: ctx.session.sessionKeyRecordId}
    })
    if (sesskonKeyRecordOld) { sessionKey = sesskonKeyRecordOld.sessionKey }
  }

  /* 如果从token中没有取到，则从微信服务器上取一次 */
  if (!sessionKey) {
    const token = await weixinAuth.getAccessToken(code)
    /*目前微信的 session_key, 有效期3天*/
    sessionKey = token.data.session_key
  }

  /* 数据解密操作 */
  const pc               = new WXBizDataCrypt(weapp.miniProgram.appId, sessionKey)
  let decryptedUserInfo  = pc.decryptData(encryptedData, iv)
  let decryptedUserInfoU = {
    'open_id'   : decryptedUserInfo.openId,
    'nick_name' : decryptedUserInfo.nickName,
    'gender'    : decryptedUserInfo.gender,
    'language'  : decryptedUserInfo.language,
    'city'      : decryptedUserInfo.city,
    'province'  : decryptedUserInfo.province,
    'country'   : decryptedUserInfo.country,
    'avatar_url': decryptedUserInfo.avatarUrl,
    'watermark' : decryptedUserInfo.watermark
  }

  /* 如果没有用户创建用户 */
  let user = await UserModel.findOne({where: {open_id: decryptedUserInfoU.open_id}})
  if (!user) {//如果用户没有查到，则创建
    let createRes       = await UserModel.create(decryptedUserInfoU)
    if (createRes){ user = createRes.dataValues }
  }

  /* 如果没有session 创建session 有就更新 */
  let sessionKeyRecord = await SessionKeyModel.findOne({where: {user_id: user.id}})    //查询session key
  if (sessionKeyRecord) {
    await sessionKeyRecord.update({sessionKey: sessionKey})
  } else {
    let sessionKeyRecordCreateRes = await SessionKeyModel.create({user_id: user.id, sessionKey: sessionKey})
    sessionKeyRecord = sessionKeyRecordCreateRes.dataValues
  }

  ctx.session.sessionKeyRecordId = sessionKeyRecord.id

  //签数据
  let authorizationToken = jsonwebtoken.sign({
      user_id    : user.id,
      nick_name  : decryptedUserInfoU.nick_name,
      avatar_url : decryptedUserInfoU.avatar_url,
      open_id    : decryptedUserInfoU.open_id,
      session_key: sessionKey
    },
    weapp.jwtSecret,
    {expiresIn: '3d'}//修改为3天，这是sessionKey的有效时间
  )

  ctx.status = 200
  ctx.body   = {code: 200, msg: 'ok', data: {...decryptedUserInfoU, authorizationToken}}
})

/**
 * 返回hi
 */
router.get('/hi', function (ctx) {
  ctx.body = ctx.request.query.name;
});

/**
 * 获取用户地址
 */
router.get("/address", async (ctx) => {
  let { user_id: user_id } = ctx.user
  let addressList          = await AddressModel.findAll({where: {"user_id": user_id}})

  ctx.status = 200
  ctx.body   = {code: 200, msg: 'ok', data: addressList}
})

/**
 * 添加用户地址
 */
router.post("/address", async (ctx) => {
  let res                                                                           = null
  let {user_id: user_id}                                                            = ctx.user
  let {userName: user_name, telNumber: tel_number, region, detailInfo: detail_info} = ctx.request.body
  let hasExistRes                                                                   = await AddressModel.findOne({where: {tel_number}})

  if (!hasExistRes) {
    res = await AddressModel.create({user_id, user_name, tel_number, region, detail_info})
  }

  ctx.status = 200
  ctx.body   = {code: 200, msg: res ? 'ok' : '', data: res}
})

/**
 * 修改用户地址
 */
router.put("/address", async (ctx) => {
  let {id, userName: user_name, telNumber: tel_number, region, detailInfo: detail_info} = ctx.request.body
  let res = await AddressModel.update(
    {user_name, tel_number, region, detail_info},
    {where: {id}}
  )

  ctx.status = 200
  ctx.body   = {code: 200, msg: res[0] > 0 ? 'ok' : '', data: res}
})

/**
 * 删除用户地址
 */
router.delete('/address/:id', async ctx=>{
  let {id}      = ctx.params
  let {user_id} = ctx.user
  let res       = await AddressModel.destroy({where:{id, user_id}})
  ctx.status    = 200
  ctx.body      = {code: 200, msg: res > 0 ? 'ok' : '', data: res}
})

/**
 * 支付开始
 */
pay(router);

/**
 * 作为一个模块抛出
 * @type {any}
 */
module.exports = router