const WebSocket = require('ws')

// websockt服务端
const wss = new WebSocket.Server({ port: 8080 })

// 广播客户端消息的方法
wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// 当有新连接进来时
wss.on('connection', (ws, req) => {
  ws.on('message', (message) => {
    console.log('收到来自pc上位机服务端的信息 --- ' + message)
    wss.broadcast(message)
  })
  ws.on('close', (code, reason) => {
    console.log('关闭与pc上位机服务端的连接 --- ' + code + reason)
  })
  ws.on('error', (error) => {
    console.log('与pc上位机服务端的连接错误 --- ' + error)
    // 关闭连接
    ws.close()
  })
  const ip = req.connection.remoteAddress
  console.log('有新连接过来')
  console.log(ip)
  ws.send('hello client!! i am server')
})
wss.on('error', err => {
  console.log('websockt出错了')
  console.log(err)
  wss.close()
})

module.exports = wss