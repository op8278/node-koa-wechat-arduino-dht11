const { resolve } = require('path');
const r = path => resolve(__dirname, path);

// The require hook will bind itself to node's require and automatically compile files on the fly.
require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: [
    'transform-decorators-legacy',
    [
      'module-resolver',
      {
        alias: {
          database: './server/database',
          config: './config',
          wechat: './server/wechat',
          decorator: './server/decorator',
          middleware: './server/middleware',
        },
      },
    ],
  ],
});
require('@babel/polyfill');
const koaAPP = require('./server');
require('./websocket').start(koaAPP.default.originApp);
