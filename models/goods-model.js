const DataTypes     = require('sequelize')
const db            = require("./db-mysql")
const options       = require('../config/model')
const CategoryModel = require('./category-model')
const BrandModel    = require('./brand-model')

module.exports = db.define("goods", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  spu_no: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  goods_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  goods_desc: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  start_price: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false
  },

  category_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {                           //关联
      model     : CategoryModel,
      key       : 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //立即检查外键约束
    },
    allowNull: false
  },
  brand_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {                           //关联
      model: BrandModel,
      key: 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //立即检查外键约束
    },
    allowNull: false
  }
}, options);