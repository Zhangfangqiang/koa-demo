const DataTypes = require('sequelize')
const db        = require("./db-mysql")
const UserModel = require('./user-model')
const options   = require('../config/model')

module.exports = db.define("order",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    out_trade_no: {               //微信商号单号
      type: DataTypes.STRING(50),
      allowNull: false
    },
    transaction_id: {            //微信交易单号
      type: DataTypes.STRING(50),
      allowNull: true           //允许为空
    },
    pay_state: {                 //支付订单的状态，0=未支付，1=已支付，2=取消或其它
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    total_fee: {//总价，单位分
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    address_id: {//收货地址id
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    address_desc: {//收货地址总描述
      type: DataTypes.TEXT('tiny'),//最大长度255个字节
      allowNull: false
    },
    goods_carts_ids: {//购买车商品ids
      type: DataTypes.JSON,
      allowNull: false
    },
    goods_name_desc: {//商品名称描述
      type: DataTypes.TEXT('tiny'),//最大长度255个字节
      allowNull: false
    }
  },
  {
    ...options,
    indexes: [{
      unique: true,// 唯一索引
      fields: ['out_trade_no']
    }]
  }
);