import hdt11 from '../database/model/hdt11_data';

const TEST_MESSAGE = '测试被动回复--模版';

const commandFunc = {
  // 开启led
  openLED: async () => {
    console.log('openLED');
    return 'openLED';
  },
  // 关闭led
  closeLED: async () => {
    console.log('closeLED');
    return 'closeLED';
  },
  // 获取最新传感器数据
  getLastSensorData: async () => {
    console.log('getLastSensorData');
    const data = await hdt11.findAll({ limit: 1 });
    return data;
  },
  // 根据limit条数获取传感器数据
  getSensorDataByLimit: async () => {
    console.log('getSensorDataByLimit');
  },
};

const commandMap = new Map([
  [['开灯', '开下灯', 'openled'], 'openLED'],
  [['关灯', '关下灯', 'closeled'], 'closeLED'],
  [['最新数据', '获取最新数据', '新数据', ''], 'getLastSensorData'],
]);

// TODO: 优化面条式代码
export default async (ctx, next) => {
  const message = ctx.formatDataFromWechat;
  let replayDataToWechat; // 准备发送给微信的数据
  console.log(message);
  // 判断接收的数据类型
  if (message.MsgType === 'text') {
    // replayDataToWechat = message.Content;
    for (const [key, value] of commandMap) {
      if (key.includes(message.Content)) {
        replayDataToWechat = await commandFunc[value]();
      }
    }
    // TODO: 判断是否控制指令
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
