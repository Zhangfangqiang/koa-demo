const short              = require('short-uuid');
const OrderModel         = require("../../models/order-model")
const wepay0             = require('../../lib/wepay0')
const wepay1             = require("../../lib/wepay1")
const wepay2             = require('../../lib/wepay2')
const {wepay: WechatPay} = require('koa3-wechat');


function init(router) {
  /**
   * 下新定单，准备支付
   */
  router.post('/order0', async ctx => {
    let {uid: userId, openId}                                            = ctx.user
    let {totalFee, addressId, addressDesc, goodsCartsIds, goodsNameDesc} = ctx.request.body     //获取传递的数据
    totalFee       = 1                                                                          //为测试方便，所有金额支付数均为1分
    let payState   = 0                                                                          //支付状态
    let outTradeNo = `${new Date().getFullYear()}${short().new()}`                              //拼接订单
    let params     = await wepay0.getBrandWCPayRequestParams(trade);
    let err        = '', res

    /**
     * 微信支付接口提交的内容
     */
    var trade = {
      body            : goodsNameDesc.substr(0, 127),
      attach          : '支付测试',
      out_trade_no    : outTradeNo,
      total_fee       : totalFee,
      trade_type      : 'JSAPI',
      spbill_create_ip: ctx.request.ip,
      openid          : openId
    };
    if (params && params.package && params.paySign) {
      res = await OrderModel.create({userId, outTradeNo, payState, totalFee, addressId, addressDesc, goodsCartsIds, goodsNameDesc})   //创建订单
      if (!res){ err = 'db create error'}
    } else {
      err = 'error! return null!'
    }

    ctx.status = 200
    ctx.body   = {code: 200, msg: !err ? 'ok' : '', data: {res, params}}
  })

  /**
   * 使用weixin-pay实现的接口，测试通过
   */
  router.post('/order1', async ctx => {
    let {user_id, open_id}                                               = ctx.user
    let {totalFee, addressId, addressDesc, goodsCartsIds, goodsNameDesc} = ctx.request.body
    totalFee       = 1
    let payState   = 0
    let outTradeNo = `${new Date().getFullYear()}${short().new()}`
    let err        = '', res

    /**
     * 微信支付接口提交的内容
     */
    var trade = {
      body            : goodsNameDesc.substr(0, 127),
      out_trade_no    : outTradeNo,
      total_fee       : totalFee,
      spbill_create_ip: ctx.request.ip,
      notify_url      : 'https://rxyk.cn/apis/pay_notify',
      trade_type      : 'JSAPI',
      openid          : open_id
    };

    let params = await (() => {
      return new Promise((resolve, reject) => {
        wepay1.getBrandWCPayRequestParams(trade, (err, result) => {
          if (err) {reject(err)}
          else {resolve(result)}
        });
      })
    })()

    if (params && params.package && params.paySign) {
      res = await OrderModel.create({user_id, outTradeNo, payState, totalFee, addressId, addressDesc, goodsCartsIds, goodsNameDesc})
      if (!res){ err = 'db create error' }
    } else {
      err = 'error! getBrandWCPayRequestParams() return null!'
      console.log(err);
    }

    ctx.status = 200
    ctx.body   = {code: 200, msg: !err ? 'ok' : '', data: {res, params}}
  })

  /**
   * 使用小微商户支付
   */
  router.post('/order2', async ctx => {
    let {user_id , open_id}                                              = ctx.user
    let {totalFee, addressId, addressDesc, goodsCartsIds, goodsNameDesc} = ctx.request.body
    totalFee       = 1
    let payState   = 0
    let outTradeNo = `${new Date().getFullYear()}${short().new()}`
    let err        = '', res

    var trade = {
      body            : goodsNameDesc.substr(0, 127), //最长127字节
      out_trade_no    : outTradeNo,
      total_fee       : totalFee,                                 //以分为单位，货币的最小金额
      spbill_create_ip: ctx.request.ip,                           //ctx.request.ip
      notify_url      : 'https://rxyk.cn/apis/pay_notify2',       //支付成功异步回调地址
      trade_type      : 'JSAPI',
      openid          : open_id
    };

    let params = wepay2.getOrderParams(trade)     //获取订单参数

    if (params && params.sign) {
      res = await OrderModel.create({user_id, out_trade_no:outTradeNo, pay_state:payState, total_fee:totalFee, address_id:addressId, address_desc:addressDesc, goods_carts_ids:goodsCartsIds, goods_name_desc:goodsNameDesc})          // 创建记录
      if (!res){ err = 'db create error'}
    } else {
      err = 'error! return null!'
      console.log(err);
    }

    ctx.status = 200
    ctx.body   = {code: 200, msg: !err ? 'ok' : '', data: {res, params}}
  })
}

module.exports = init