const DataTypes     = require("sequelize");
const db            = require("./db-mysql")
const options       = require('../config/model')
const UserModel     = require('./user-model')
const GoodsModel    = require('./goods-model')
const GoodsSkuModel = require('./goods-sku-model')

module.exports = db.define("goods_carts", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {                           //关联
      model: UserModel,
      key: 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
    },
    allowNull: false
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
  goods_sku_desc: {
    type: DataTypes.TEXT('tiny'),
    allowNull: false
  },
  goods_sku_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {                           //关联
      model: GoodsSkuModel,
      key: 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
    },
    allowNull: false
  },
  num: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  }
}, options)