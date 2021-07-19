const DataTypes  = require( 'sequelize' )//修改类型名称从Sequelize变成DataTypes
const db         = require("./db-mysql")
const GoodsModel = require('./goods-model')
const options    = require('../config/model')

// 颜色、尺码
module.exports = db.define("goods_attr_key",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    goods_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    attr_key: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, options);