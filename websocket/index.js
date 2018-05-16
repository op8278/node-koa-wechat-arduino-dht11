const WebSocket = require('ws');
const hdt11Data = require('../server/database/model/hdt11_data').default;

// websockt服务端
let wss = null;

function start(app) {
  // 开启websocket服务端
  // wss = new WebSocket.Server({ server: app });
  wss = new WebSocket.Server({ port: 8088 });

  // 广播客户端消息的方法
  wss.broadcast = data => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
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
      const [temperature, humidity] = message.split(' ');
      // TODO: 保存到数据库中
      hdt11Data
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
}

module.exports = {
  start,
  wss,
};
