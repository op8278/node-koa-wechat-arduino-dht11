import glob from 'glob';
import { resolve } from 'path';

export const initDB = app => {
  // 导入并初始化db
  const db = require('../database').default;
  // TODO: 待删除:测试实例是否连接成功
  db
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  // 导入所有的model表
  glob.sync(resolve(__dirname, '../database/model', './*.js')).forEach(item => {
    console.log(`开始导入---${item}`);
    require(item);
  });
};
