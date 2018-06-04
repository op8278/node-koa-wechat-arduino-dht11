export default {
  server: {
    host: '127.0.0.1',
    port: 3999, // http服务器,websocket服务器的共用端口
  },
  db: {
    database: 'dht11', // 选择的database
    dialect: 'mysql',
    port: '3306', // 端口
    host: '127.0.0.1',
    username: 'root', // 数据库账户
    password: 'root', // 数据库密码
  },
  wechat: {
    appID: '你的公众号的appID', // 公众号
    appSecret: '你的公众号的appSecret', // 公众号
    token: '你的公众号的token', // 公众号
  },
};
