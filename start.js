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
        root: ['./server'],
        alias: {
          '~': './',
          database: './database',
          config: './config',
          wechat: './wechat',
          decorator: './decorator',
          middleware: './middleware',
        },
      },
    ],
  ],
});
require('./server');
