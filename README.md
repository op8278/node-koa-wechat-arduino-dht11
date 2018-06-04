# node-koa-wechat-arduino-dht11

# 介绍

本系统主要功能如下：

* 把 Arduino 端的 DHT11 温湿度模块收集到的温湿度数据，通过 ESP8266WIFI 模块，用 websocket 协议上传到服务器上，并持久化保存到数据库中。
* 在微信公众号上，通过输入控制指令，来控制 Arduino 上面的模块(目前只有 LED 模块)。

### 技术栈

服务端主要的第三方模块

* [koa](https://github.com/koajs/koa)
* [sequelize](https://github.com/sequelize/sequelize)
* [ws](https://github.com/websockets/ws)

Arduino 端主要的第三方模块

* [ESP8266 core for Arduino](https://github.com/esp8266/Arduino)
* [arduinoWebSockets](https://github.com/Links2004/arduinoWebSockets)
* [DHT11 library for Arduino](https://github.com/adidax/dht11)

### 配置

需要自己配置 `config.js` 文件：

* `server.port` ： http 服务器,websocket 服务器的共用端口, 默认`3999`
* `db.database` ： 数据库所使用的 database 名字,默认 `dht11`
* `db.dialect` ： 使用的数据库类型,默认 `mysql`
* `db.port` ： 数据库端口,默认`3306`
* `db.username` ： 数据库账户,默认 `root`
* `db.password` ： 数据库密码,默认`root`
* `wechat.appID` ： 公众号的 appID
* `wechat.appSecret` ： 公众号的 appSecret
* `wechat.token` ： 公众号的 token

注意：其中`db`的配置可以参考[sequelize](https://github.com/sequelize/sequelize)的文档

### 控制指令

目前有以下的几个控制指令,定义在`./server/wechat/reply.js`文件中

```
const commandMap = new Map([
  [['开灯', '开下灯', 'openled'], 'openLED'],
  [['关灯', '关下灯', 'closeled'], 'closeLED'],
  [['最新数据', '获取最新数据', '新数据', 'lastdata'], 'getLastSensorData'],
  [['获取最新5条数据'], 'getSensorDataByLimit'],
]);
const commandFunc = {
  // 开启led
  openLED: async () => {
    console.log('openLED');
    const { broadcast } = require('../../websocket');
    try {
      await broadcast('openLED');
      return '开启led成功';
    } catch (error) {
      console.log(error);
      return `开启led失败\n${error.message}`;
    }
  },
  // 获取最新传感器数据
  getLastSensorData: async () => {
    console.log('getLastSensorData');
    const [data, ...ohter] = await dht11.findAll({ limit: 1, order: [['create_time', 'DESC']] });
    console.log(data);
    const replyContent = assembleSensorDataContent(data);
    return replyContent;
  },
  ...
};
```

### 安装

1.  `git clone https://github.com/op8278/node-koa-wechat-arduino-dht11.git`
2.  `cd node-koa-wechat-dht11`
3.  `yarn intalll 或者 npm install`

### 运行

1.  `npm run dev`

### 演示

![控制指令](https://github.com/op8278/node-koa-wechat-arduino-dht11/blob/master/img/控制指令.jpg)

![关灯状态](https://github.com/op8278/node-koa-wechat-arduino-dht11/blob/master/img/关灯状态.jpg)

![开灯状态](https://github.com/op8278/node-koa-wechat-arduino-dht11/blob/master/img/开灯状态.jpg)

![获取最新数据](https://github.com/op8278/node-koa-wechat-arduino-dht11/blob/master/img/获取最新数据.jpg)
