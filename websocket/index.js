const WebSocket = require('ws');
const dht11Data = require('../server/database/model/dht11_data').default;
const config = require('config').default;

// websockt服务端
let wss = null;
function start(app) {
  // 开启websocket服务端
  // 将koa端口和websocket端口合并在一起
  wss = new WebSocket.Server({ server: app });
  // 广播客户端消息的方法
  wss.broadcast = async data => {
    const promiseArray = [];
    wss.clients.forEach(client => {
      const tempPromise = new Promise((resolve, reject) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data, function(err) {
            if (err) {
              console.log(err);
              return reject(new Error(err));
            }
            resolve();
          });
        } else {
          reject(new Error('esp8266状态不为WebSocket.OPEN'));
        }
      });
      promiseArray.push(tempPromise);
    });
    if (promiseArray.length === 0) {
      return Promise.reject(new Error('没有与esp8266连接'));
    }
    return Promise.all(promiseArray);
  };

  // 当有新连接进来时
  wss.on('connection', (ws, req) => {
    // TODO: 根据req传来的参数,判断是否为esp8266端
    const ip = req.connection.remoteAddress;
    console.log('有新连接过来');
    console.log(ip);
    ws.send('hello client!! i am server');

    ws.on('message', message => {
      console.log('收到来自esp8266的信息 --- ' + message);
      // TODO: 校验数据合法性
      const [humidity, temperature] = message.split(' ');
      if (!temperature || !humidity || temperature < 0 || humidity < 0) {
        console.log('无效的温湿度数据');
        return;
      }
      dht11Data
        .create({ temperature, humidity })
        .then(data => {
          console.log('保存成功');
        })
        .catch(err => {
          console.log(err);
        });
    });
    ws.on('close', (code, reason) => {
      console.log('关闭与esp8266的连接 --- ' + code + reason);
    });
    ws.on('error', error => {
      console.log('与esp8266连接错误 --- ' + error);
      // 关闭连接
      ws.close();
    });
  });
  wss.on('error', err => {
    console.log('websockt出错了');
    console.log(err);
    wss.close();
  });
  wss.on('listening', () => {
    console.log(`websocket服务器已经启动,端口为${config.server.port}`);
  });
  console.log(wss);
}
async function broadcast(data) {
  const promiseArray = [];
  wss.clients.forEach(client => {
    const tempPromise = new Promise((resolve, reject) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, function(err) {
          if (err) {
            console.log(err);
            return reject(new Error(err));
          }
          resolve();
        });
      } else {
        reject(new Error('esp8266状态不为WebSocket.OPEN'));
      }
    });
    promiseArray.push(tempPromise);
  });
  if (promiseArray.length === 0) {
    return Promise.reject(new Error('没有与esp8266连接'));
  }
  return Promise.all(promiseArray);
}

module.exports = {
  start,
  wss,
  broadcast,
};
// module.exports = wss;
