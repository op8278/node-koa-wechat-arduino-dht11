import Sequelize from 'sequelize';
import db from '../../database';

const DEFAULT_ACCESSS_TOKEN_NAME = 'access_token';
const wechatAccessToken = db.define('wechat_access_token', {
  name: {
    type: Sequelize.STRING,
    defaultValue: DEFAULT_ACCESSS_TOKEN_NAME,
  },
  access_token: {
    type: Sequelize.STRING,
  },
  expires_in: {
    type: Sequelize.BIGINT,
    // TODO: INTEGER?
    // type: Sequelize.BIGINT,
  },
  create_time: {
    type: Sequelize.DATE,
  },
  update_time: {
    type: Sequelize.DATE,
  },
});

// 添加静态方法
wechatAccessToken.getAccessToken = async () => {
  console.log('获取accessToken中...');
  try {
    const data = await wechatAccessToken.findOne({ where: { name: DEFAULT_ACCESSS_TOKEN_NAME } });
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
wechatAccessToken.saveAccessToken = async options => {
  console.log('保存accessToken中...');
  try {
    let data = await wechatAccessToken.findOne({ where: { name: DEFAULT_ACCESSS_TOKEN_NAME } });
    if (data) {
      // 更新字段
      data.access_token = options.access_token;
      data.expires_in = options.expires_in;
    } else {
      // 创建新实例
      data = wechatAccessToken.build({
        name: DEFAULT_ACCESSS_TOKEN_NAME,
        access_token: options.access_token,
        expires_in: options.expires_in,
      });
    }
    await data.save();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default wechatAccessToken;
