const db        = require("./db-mysql")
const DataTypes = require('sequelize')
const UserModel = require('./user-model')
const options   = require('../config/model')

module.exports = db.define("address", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    references: {
      model: UserModel,
      key: 'id',
      deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
    },
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  tel_number: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  region: {
    type: DataTypes.JSON,
    allowNull: false
  },
  detail_info: {
    type: DataTypes.STRING(500),
    allowNull: false
  }
}, {
  ...options,
  indexes: [{
    unique: true,// 唯一索引
    fields: ['tel_number']
  }]
})