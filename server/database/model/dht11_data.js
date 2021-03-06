import Sequelize from 'sequelize';
import db from '../../database';

const dht11Data = db.define('dht11_data', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  temperature: {
    type: Sequelize.STRING,
  },
  humidity: {
    type: Sequelize.STRING,
  },
  create_time: {
    type: Sequelize.DATE,
  },
  update_time: {
    type: Sequelize.DATE,
  },
  // TODO: 添加校验temperature,humidity的规则
});

export default dht11Data;
