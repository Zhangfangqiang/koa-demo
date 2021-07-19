const DataTypes  = require("sequelize")
const db         = require("./db-mysql")
const GoodsModel = require('./goods-model')
const options    = require('../config/model')


module.exports = db.define("goods_info",
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
        model     : GoodsModel,
        key       : 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE    //设置约束类型
      },
      allowNull: false
    },
    kind: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, options);