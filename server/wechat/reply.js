import moment from 'moment';
import hdt11 from '../database/model/hdt11_data';

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
    const wss = require('../../websocket');
    if (wss) {
      console.log('wss存在');
      try {
        await wss.broadcast('openLED');
        return '开启led成功';
      } catch (error) {
        console.log(error);
        return '开启led失败';
      }
    } else {
      return '已经与硬件端断开连接,开启led失败';
    }
  },
  // 关闭led
  closeLED: async () => {
    console.log('closeLED');
    const wss = require('../../websocket');
    if (wss) {
      console.log('wss存在');
      try {
        await wss.broadcast('closeLED');
        return '关闭led成功';
      } catch (error) {
        console.log(error);
        return '关闭led失败';
      }
    } else {
      return '已经与硬件端断开连接,关闭led失败';
    }
  },
  // 获取最新传感器数据
  getLastSensorData: async () => {
    console.log('getLastSensorData');
    const [data, ...ohter] = await hdt11.findAll({ limit: 1, order: [['create_time', 'DESC']] });
    console.log(data);
    const replyContent = assembleSensorDataContent(data);
    return replyContent;
  },
  // 根据limit条数获取传感器数据
  getSensorDataByLimit: async (limit = 5) => {
    console.log('getSensorDataByLimit');
    const dataArray = await hdt11.findAll({ limit, order: [['create_time', 'DESC']] });
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
  [['5', '获取最新5条数据'], 'getSensorDataByLimit'],
]);

// TODO: 优化面条式代码
export default async (ctx, next) => {
  const message = ctx.formatDataFromWechat;
  let replayDataToWechat; // 准备发送给微信的数据
  console.log(message);
  // 判断接收的数据类型
  if (message.MsgType === 'text') {
    // 判断是否控制指令
    for (const [key, value] of commandMap) {
      if (key.includes(message.Content)) {
        replayDataToWechat = await commandFunc[value]();
      }
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
  } else if (message.MsgType === 'event') {
    console.log(message.Event + '-----' + message.EventKey);
    replayDataToWechat = message.Event + '-----' + message.EventKey;
  }
  return replayDataToWechat;
};
