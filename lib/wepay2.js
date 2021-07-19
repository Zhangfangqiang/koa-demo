const md5     = require('md5')
const request = require('request')                      //请求
const xml2js  = require('xml2js')
const mchid   = '9c97b8fce69e421ca3b6a4df72754ba2'      //在下面设置商户号
const secret  = 'ff28f46c445243aea7c5438febc7a3a9'      //在下面设置密钥

/**
 * 获得随机数
 * @param minNum
 * @param maxNum
 */
const getRandomNumber = (minNum = 1000000000, maxNum = 99999999999999) => {
  parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
}

/**
 * json 转换为XML
 * @param json
 * @returns {*}
 */
const buildXML = function (json) {
  var builder = new xml2js.Builder();
  return builder.buildObject(json);
};

/**
 * 获得标记
 * @param obj
 * @returns {string}
 */
const getSign = (obj) => {
  let params = []
  let keys   = Object.keys(obj)             //获取json key

  keys.sort()                               //排序
  keys.forEach(item => {
    if (obj[item] != '' && obj[item] != undefined) {
      params.push(item + '=' + obj[item])      //把不等于空字符串的键值 , 拼接起来
    }
  })

  params.push('key=' + secret)

  let paramStr   = params.join('&')
  let signResult = md5(paramStr).toUpperCase()
  return signResult
}

/**
 * 获取订单参数
 * @param trade
 * @returns {{nonce_str: void, mchid: string, out_trade_no: *, total_fee: *, attach: string, body, notify_url: (string|*), goods_detail: string}}
 */
const getOrderParams = (trade) => {
  let nonce_str    = getRandomNumber() // 随机数
  let goods_detail = ''
  let attach       = ''

  let paramsObject = {
    mchid        : mchid,
    total_fee    : trade.total_fee,
    out_trade_no : trade.out_trade_no,
    body         : trade.body,
    goods_detail : goods_detail,
    attach       : attach,
    notify_url   : trade.notify_url,
    nonce_str    : nonce_str
  }

  let sign          = getSign(paramsObject)          //获得签验的md5
  paramsObject.sign = sign                           //签验的数据放入paramsObject里面
  return paramsObject
}

/**
 * 退款接口
 * @param order_id
 * @returns {Promise<unknown>}
 */
const refund = async (order_id) => {
  let order = {
    mchid       : mchid,
    order_id    : order_id,
    nonce_str   : getRandomNumber(),
    refund_desc : 'no',
    notify_url  : 'https://rxyk.cn/apis/pay_notify3',
  }

  order.sign = getSign(order);

  // 以json方式提交
  return new Promise((resolve, reject) => {
    request(
      {
        url     : "https://admin.xunhuweb.com/pay/refund",
        method  : "POST",
        headers : {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body    : JSON.stringify(order),
      },
      function (err, res, body) {
        if (err) { reject(err) }
        else { resolve(body) }
      });
  })
}

module.exports = {getOrderParams, refund}