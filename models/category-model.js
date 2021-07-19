const DataTypes = require("sequelize")
const db        = require("./db-mysql")
const options   = require('../config/model')

module.exports = db.define("category", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  category_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
},options);