const fs    = require('fs')

const wxpay1 = {
  appId       : 'wxc3db312ddf9bcb01',                                    //小程序APPID
  mchId       : '1410138302',                                            //微信商户id
  notifyUrl   : 'https://rxyk.cn/apis/pay_notify',                       //支付成功通知地址
  partnerKey  : 'RHG5VbeX9h11oXaRar2FglRcCNVosCBM',                      //微信商户平台的api key，在pay.weixin.qq.com设置 , 用于给api加密的
  pfx         : fs.readFileSync(__dirname + '/apiclient_cert.p12'), //证书
  passphrase: '日行一课'                                                   // 添加了无法退款
}

module.exports = wxpay1