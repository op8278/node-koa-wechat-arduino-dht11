import { controller, get, post } from '../decorator/router';
import config from '../config';
import sha1 from 'sha1';
@controller('/wechat')
export class wechatController {
  @get('/message')
  async getMessageFromWechat(ctx, next) {
    // 鉴定是否来自微信端的信息

    // 校验微信验证
    const token = config.wechat.token;
    const { signature, nonce, timestamp, echostr } = ctx.query;
    console.log('----------微信的query-------------');
    console.log(ctx.query);
    const str = [token, timestamp, nonce].sort().join('');
    const sha = sha1(str);
    if (ctx.method === 'GET') {
      if (sha === signature) {
        console.log('GET --- 来自微信');
        ctx.body = echostr;
      } else {
        ctx.body = 'GET -- Signature Error';
      }
    }
    return 'test';
  }
}
