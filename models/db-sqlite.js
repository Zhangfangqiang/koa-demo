const {Sequelize} = require('sequelize');
const path        = require('path')

const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/data.sqlite')
});

db.authenticate().then(() => {
  console.log('数据库连接成功')
}).catch(err => {
  console.error('数据库连接异常', err)
})

module.exports = db