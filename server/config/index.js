export default {
  server: {
    host: '127.0.0.1',
    port: 3001,
  },
  db: 'mongodb://localhost/hdt11', // mongo地址
  site_root_url: 'http://ssr.hk1.mofasuidao.cn', // 项目域名
  admin_email: 'admin@admin.com', // 默认管理员邮箱(帐号)
  admin_password: 'admin', // 默认管理员密码
  wechat: {
    appID: 'wx0d95ddaac2cd9285', // 测试公众号
    appSecret: 'b7e871670d6997a887736f976d52e717', // 测试公众号
    token: 'hellowechat',
  },
};
