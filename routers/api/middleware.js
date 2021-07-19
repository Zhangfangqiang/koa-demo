const util            = require('util');
const jsonwebtoken    = require('jsonwebtoken')                        //签发验证工具
const weapp           = require('../../config/weapp')                  //配置文件

/**
 * 添加一个路由中间键
 */
module.exports = (router)  => {
  router.use(async (ctx, next) => {
    if (!ctx.url.includes('login') && !ctx.url.includes('web')) {
      try {
        let token = ctx.request.header.authorization;                                           //获取token
        token = token.split(' ')[1]                                                    //删除第一个空格
        let payload = await util.promisify(jsonwebtoken.verify)(token, weapp.jwtSecret);        //根据token和加密字符串获得数据如果签名不对，这里会报错，走到catch分支

        let {open_id, nick_name, avatar_url, user_id} = payload
        ctx['user'] = {open_id, nick_name, avatar_url, user_id}
        await next()    //所有next都要加await，重要！
      } catch (err) {
        throw err;
      }
    } else {
      await next()      //所有next都要加await，重要！
    }
  })
}