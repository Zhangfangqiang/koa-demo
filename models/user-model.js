const DataTypes = require('sequelize')
const options   = require('../config/model')
const db        = require("./db-mysql")

/**
 * 定义模型并且抛出,这里的模型不光可以当模型
 * 还可以自动根据模型创建数据库
 * @type {ModelCtor<Model>}
 */
module.exports = db.define('user',
  /*模型配置*/
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nick_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
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
    open_id: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, options)