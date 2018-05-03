import getRawBody from 'raw-body';
import * as util from '../util';
import wss from '../../websocket/index.js';
import { replyStrategy } from '../wechat';

export const getMessageFromWechat = async (ctx, next, reply) => {
  if (ctx.method === 'GET') {
    console.log(ctx.method);
    return (ctx.body = ctx.echostr);
  }
  console.log('解析微信传过来的xml消息......');
  // 解析微信传过来的xml消息
  const XMLDataFromWechat = await getRawBody(ctx.req, {
    length: ctx.length,
    limit: '1mb',
    encoding: ctx.charset,
  });
  console.log(XMLDataFromWechat);
  console.log('----------接受的数据-------------');
  // 解析微信传过来的xml
  const JSONDataFromWechat = await util.parseXML(XMLDataFromWechat);
  console.log(JSONDataFromWechat);
  // 提取重要信息(tpl模版需要)
  // xml => json
  const message = util.formatMessage(JSONDataFromWechat.xml);
  ctx.formatDataFromWechat = message;
  console.log(message);
  // 根据消息,调用相应的业务逻辑
  ctx.replayDataToWechat = await replyStrategy.apply(ctx, [ctx, next]);
  // 广播给websocket客户端
  // TODO: 判断是否传输成功
  wss.broadcast(message.Content);
  // 组装xml消息返回给微信
  const xml = util.tpl(ctx.formatDataFromWechat, ctx.replayDataToWechat);
  console.log('----------回复的数据-------------');
  console.log(xml.trim());
  return xml;
};
