import { controller, get, post } from '../decorator/router';
import wss from '../../websocket/index.js';
import hdt11_data from '../database/model/hdt11_data';

@controller('/test')
export class TestController {
  @get('/a')
  async test(ctx, next) {
    // 获取查询参数limit
    const { limit = 10 } = ctx.query;
    try {
      // wss.broadcast('测试跨文件访问websockt的广播send方法');
      // 查询数据库
      const data = await hdt11_data.findAndCountAll();
      // 整理数据
      console.log(data);
      // 返回JSON数据
      ctx.apiSuccess(data.rows);
    } catch (error) {
      console.log('controller---test---失败');
      ctx.apiError('test失败');
    }
  }
  @post('/a')
  async test(ctx, next) {
    try {
      // 获取post过来的参数
      const { temperature, humidity } = ctx.request.body;
      const data = { temperature, humidity };
      console.log(data);
      const temp = await hdt11_data.create({ temperature, humidity });
      ctx.apiSuccess(data);
    } catch (error) {
      console.log('controller---test---失败');
      console.log(error);
      ctx.apiError(error.message);
    }
  }
}
