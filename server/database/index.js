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
  timezone: '+08:00', // 东八时区,
  define: {
    timestamps: false,
    hooks: {
      // 设置时间
      beforeValidate: function(obj) {
        let now = Date.now();
        if (obj.isNewRecord) {
          obj.create_time = now;
          obj.update_time = now;
        } else {
          obj.update_time = Date.now();
        }
      },
    },
  },
});
// 导入ORM映射表
// TODO: 待删除:测试是否能拿到数据
// const hdt11_data = sequelize.import('../database/model/hdt11_data');
// hdt11_data.findAll().then(data => {
//   for (const item of data) {
//     console.log(item);
//   }
// });

export default sequelize;
