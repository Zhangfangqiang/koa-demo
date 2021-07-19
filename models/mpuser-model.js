const DataTypes = require('sequelize')
const db        = require("./db-mysql")
const options   = require('../config/model')


module.exports = db.define('mpuser', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    openid: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    sex: {
      type: DataTypes.BIGINT.UNSIGNED
    },
    language: {
      type: DataTypes.STRING(10)
    },
    city: {
      type: DataTypes.STRING(20)
    },
    province: {
      type: DataTypes.STRING(20)
    },
    country: {
      type: DataTypes.STRING(10)
    },
    headimgurl: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    privilege: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    ...options,
    indexes: [{
      unique: true,// 唯一索引
      fields: ['openid']
    }]
  }
)