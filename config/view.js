const path         = require('path');                  //路径拼接
const htmlMinifier = require('html-minifier')          //用于压缩html的
const  common      = require("../lib/common")          //用于处理时间的

module.exports = {
  root         : path.join(__dirname, '../views'),
  minimize     : true,
  htmlMinifier : htmlMinifier,
  htmlMinifierOptions: {
    collapseWhitespace   : true,
    minifyCSS            : true,
    minifyJS             : true,
    ignoreCustomFragments: []       // 运行时自动合并：rules.map(rule => rule.test)
  },
  escape  : true,
  extname : '.html',
  debug   : process.env.NODE_ENV !== 'production',
  imports : common,
  static  : {rootDir: 'public', rootPath: '/public'}
}