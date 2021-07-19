const fs   = require('fs')
const path = require('path')

/**
 * 递归获取目录
 * 放到 module.exports里没法递归
 * @param dir
 * @param filesList
 * @returns {*[]}
 */
const readFileList = (dir, filesList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((item, index) => {
    let fullPath = path.join(dir, item);                //拼接路径
    let stat = fs.statSync(fullPath);               //获取信息

    if (stat.isDirectory()) {                           //判断是否是目录
      readFileList(path.join(dir, item), filesList);    //递归读取文件
    } else {
      filesList.push(fullPath);                         //入栈
    }
  });

  return filesList;
}


const doExchange = (arr) => {
  var len = arr.length;

  if (len >= 2) {
    var len1  = arr[0].length;         //第一个数组的长度
    var len2  = arr[1].length;         //第二个数组的长度
    var items = [];                    //申明一个新数组,做数据暂存
    var newArr = [];

    /*2层嵌套循环,将组合放到新数组中*/
    for (var i = 0; i < len1; i++) {
      for (var j = 0; j < len2; j++) {
        items.push([arr[0][i], arr[1][j]])
      }
    }

    // 将新组合的数组并到原数组中
    for (var i = 2; i < arr.length; i++) {
      newArr[i - 1] = arr[i];
    }

    newArr[0] = items;
    // 执行回调
    return doExchange(newArr);
  } else {
    return arr[0];
  }
}


module.exports = {

  readFileList,
  doExchange,

  /**
   * 时间戳转文字
   * @param d
   * @param fmt
   * @returns {*}
   */
  dataFormat: (d, fmt) => {
    var o = {
      "M+": d.getMonth() + 1,                                 //月份
      "d+": d.getDate(),                                      //日
      "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12,  //小时
      "H+": d.getHours(),                                     //小时
      "m+": d.getMinutes(),                                   //分
      "s+": d.getSeconds(),                                   //秒
      "q+": Math.floor((d.getMonth() + 3) / 3),            //季度
      "S": d.getMilliseconds()                                //毫秒
    };

    var week = {
      "0": "/u65e5",
      "1": "/u4e00",
      "2": "/u4e8c",
      "3": "/u4e09",
      "4": "/u56db",
      "5": "/u4e94",
      "6": "/u516d"
    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[d.getDay() + ""]);
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return fmt;
  },

  /**
   * 将数据循环多次并返还
   * @param times
   * @param generator
   * @returns {*[]}
   */
  arrayFor: function (times, data) {
    var result = [];
    for (var i = 0; i < times; ++i) {
      result.push(data);
    }
    return result;
  }
}