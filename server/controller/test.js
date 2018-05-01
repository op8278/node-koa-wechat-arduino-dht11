import { controller, get } from '../decorator/router';
import wss from '../../websocket/index.js';
@controller('/test')
export class TestController {
  @get('/a')
  async test(ctx, next) {
    // 获取查询参数limit
    const { limit = 10 } = ctx.query;
    try {
      // 查询数据库
      const retData = { test: 'asdasa' };
      console.log(retData);
      // 整理数据
      // 返回JSON数据
      wss.broadcast('测试跨文件访问websockt的广播send方法')
      ctx.apiSuccess(retData);
    } catch (error) {
      console.log('controller---test---失败');
      ctx.apiError('test失败');
    }
  }
}
