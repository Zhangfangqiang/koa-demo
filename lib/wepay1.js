const fs                 = require('fs');
const {wepay: WechatPay} = require('koa3-wechat');

/**
 * 普通商户的参数支付参数配置
 * @type {{mchId: string, pfx: Buffer, partnerKey: string, appId: string, notifyUrl: string}}
 */
let config = {
 appId       : 'wxc3db312ddf9bcb01',                                    //小程序APPID
 mchId       : '1410138302',                                            //微信商户id
 notifyUrl   : 'https://rxyk.cn/apis/pay_notify',                       //支付成功通知地址
 partnerKey  : 'RHG5VbeX9h11oXaRar2FglRcCNVosCBM',                      //微信商户平台的api key，在pay.weixin.qq.com设置 , 用于给api加密的
 pfx         : fs.readFileSync(__dirname + '/apiclient_cert.p12'), //证书
 //passphrase: '日行一课'        // 添加了无法退款
}

let wepay1      = new WechatPay(config);    //初始化
module.exports  = wepay1                     //以模块的形式抛出