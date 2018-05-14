import { controller, get, post } from '../decorator/router';
import * as util from '../util';
import { wechatService } from '../service';

const TYPE_XML = 'application/xml';
const TYPE_JSON = 'application/json';

@controller('/wechat')
export class wechatController {
  @get('/message')
  async invalidateMessageFromWechat(ctx, next) {
    // 校验微信验证
    if (!util.isValidatedWechatSignature(ctx)) {
      console.log('不是来自微信的get请求');
      return (ctx.body = '不接受不是来自微信的请求!');
    }
    ctx.status = 200;
    ctx.type = TYPE_XML;
    ctx.body = ctx.echostr;
  }
  @post('/message')
  async getMessageFromWechat(ctx, next) {
    console.log('post------');
    // 校验微信验证
    if (!util.isValidatedWechatSignature(ctx)) {
      console.log('不是来自微信的post请求');
      return (ctx.body = '不接受不是来自微信的请求!');
    }
    try {
      // 进行业务逻辑
      const xml = await wechatService.getMessageFromWechat(ctx, next);
      ctx.status = 200;
      ctx.type = TYPE_XML;
      ctx.body = xml;
    } catch (error) {
      console.log(error);
      ctx.status = 200;
      ctx.type = TYPE_XML;
      ctx.body = 'error';
    }
  }
}
