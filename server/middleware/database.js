import Sequelize from 'sequelize';
import config from '../../config';

// 新建sequelize实例
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
// TODO: 待删除:测试实例是否连接成功
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// 导入ORM映射表
// TODO: 待删除:测试是否能拿到数据
const hdt11_data = sequelize.import('../database/model/hdt11_data');
hdt11_data.findAll().then(data => {
  for (const item of data) {
    console.log(item);
  }
});
