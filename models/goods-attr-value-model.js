const DataTypes  = require( 'sequelize' )//修改类型名称从Sequelize变成DataTypes
const db         = require("./db-mysql")
const GoodsModel = require('./goods-model')
const options    = require('../config/model')

module.exports = db.define("goods_attr_value",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    goods_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      references: {                           //关联
        model: GoodsModel,
        key: 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      },
      allowNull: false
    },
    attr_key_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    attr_value: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },options)