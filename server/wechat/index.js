import replyStrategy from './reply';
import WechatClient from './wechat-client';
import config from '../../config';
import wechatAccessTokenModel from '../database/model/wechat_access_token';

const wechatClient = new WechatClient({
  appID: config.wechat.appID,
  appSecret: config.wechat.appSecret,
  getAccessToken: wechatAccessTokenModel.getAccessToken,
  saveAccessToken: wechatAccessTokenModel.saveAccessToken,
});
export { replyStrategy, wechatClient };
