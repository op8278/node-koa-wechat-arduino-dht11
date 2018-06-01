import moment from 'moment';
import dht11 from '../database/model/dht11_data';

// 组装回复给微信的传感器数据content
const assembleSensorDataContent = (data, index) => {
  let replyContent = ``;
  if (!index && index !== 0) {
    replyContent = `
      当前时间: ${moment(data.get('create_time')).format('YYYY-MM-DD HH:mm:ss')}
      当前温度: ${data.get('temperature')}°C
      当前湿度: ${data.get('humidity')}%
    `;
  } else {
    replyContent = `
    第${index + 1}条数据:
        时间: ${moment(data.get('create_time')).format('YYYY-MM-DD HH:mm:ss')}
        温度: ${data.get('temperature')}°C
        湿度: ${data.get('humidity')}%
    `;
  }
  return replyContent;
};
const commandFunc = {
  // 开启led
  openLED: async () => {
    console.log('openLED');
    const { wss } = require('../../websocket');
    if (wss) {
      console.log('wss存在');
      try {
        await wss.broadcast('openLED');
        return '开启led成功';
      } catch (error) {
        console.log(error);
        return `开启led失败\n${error.message}`;
      }
    } else {
      return 'websocket服务器奔溃,开启led失败';
    }
  },
  // 关闭led
  closeLED: async () => {
    console.log('closeLED');
    const { wss } = require('../../websocket');
    if (wss) {
      console.log('wss存在');
      try {
        await wss.broadcast('closeLED');
        return '关闭led成功';
      } catch (error) {
        console.log(error);
        return `关闭led失败\n${error.message}`;
      }
    } else {
      return 'websocket服务器奔溃,关闭led失败';
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
  // 根据limit条数获取传感器数据
  getSensorDataByLimit: async (limit = 5) => {
    console.log('getSensorDataByLimit');
    const dataArray = await dht11.findAll({ limit, order: [['create_time', 'DESC']] });
    console.log(dataArray);
    let replyContent = ``;
    dataArray.forEach((data, index) => {
      replyContent += assembleSensorDataContent(data, index);
    });
    return replyContent;
  },
};

const commandMap = new Map([
  [['开灯', '开下灯', 'openled'], 'openLED'],
  [['关灯', '关下灯', 'closeled'], 'closeLED'],
  [['最新数据', '获取最新数据', '新数据', 'lastdata'], 'getLastSensorData'],
  [['获取最新5条数据'], 'getSensorDataByLimit'],
]);

// TODO: 优化面条式代码
export default async (ctx, next) => {
  const message = ctx.formatDataFromWechat;
  let replayDataToWechat; // 准备发送给微信的数据
  // 判断接收的数据类型
  if (message.MsgType === 'text') {
    // 判断是否控制指令
    for (const [key, value] of commandMap) {
      if (key.includes(message.Content)) {
        replayDataToWechat = await commandFunc[value]();
      }
    }
  } else if (message.MsgType === 'event') {
    console.log(message.Event + '-----' + message.EventKey);
    // replayDataToWechat = message.Event + '-----' + message.EventKey;
    // 判断是否控制指令
    switch (message.Event) {
      case 'CLICK':
        replayDataToWechat = await commandFunc[message.EventKey]();
        break;
      case 'subscribe':
        replayDataToWechat = `欢迎订阅!
      目前支持以下指令:
          1.开灯,开下灯,openled --- 开启LED灯
          2.关灯,关下灯,closeled --- 关闭LED灯
          3.最新数据,获取最新数据,新数据,lastdata --- 最新的温湿度数据
          4.获取最新5条数据, --- 获取最新5条数据
        `;
        break;
      default:
        replayDataToWechat = `目前不支持该事件类型:${message.Event}`;
        break;
    }
  } else if (message.MsgType === 'image') {
    replayDataToWechat = {
      type: 'image',
      mediaId: message.MediaId,
    };
  } else if (message.MsgType === 'voice') {
    // TODO: 语音判断是否控制指令
    replayDataToWechat = {
      type: 'voice',
      mediaId: message.MediaId,
    };
  } else if (message.MsgType === 'video') {
    replayDataToWechat = {
      type: 'video',
      mediaId: message.MediaId,
    };
  } else if (message.MsgType === 'location') {
    replayDataToWechat = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label;
  } else if (message.MsgType === 'link') {
    replayDataToWechat = [
      {
        title: message.Title,
        description: message.Description,
        picUrl:
          'https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=a60cbcc5094f78f0800b9df5410a6d68/00e93901213fb80e260d43463cd12f2eb8389446.jpg',
        url: message.Url,
      },
    ];
  }
  return replayDataToWechat;
};

// const createMemu = () => {
//   const wechatClient = require('./index').wechatClient;
//   const menu = {
//     button: [
//       {
//         name: '指令',
//         sub_button: [
//           { type: 'click', name: '开灯', key: 'openLED', sub_button: [] },
//           { type: 'click', name: '关灯', key: 'closeLED', sub_button: [] },
//           { type: 'click', name: '获取最新数据', key: 'getLastSensorData', sub_button: [] },
//           { type: 'click', name: '获取最新5条数据', key: 'getSensorDataByLimit', sub_button: [] },
//         ],
//       },
//     ],
//   };
//   replayDataToWechat = await wechatClient.haddle('createMenu', menu);
//   return replayDataToWechat
// };
