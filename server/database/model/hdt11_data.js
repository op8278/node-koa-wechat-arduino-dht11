import Sequelize from 'sequelize';
import db from '../../database';

const hdt11Data = db.define('hdt11_data', {
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
});

export default hdt11Data;
