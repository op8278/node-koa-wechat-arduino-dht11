import { controller, get } from '../decorator/router';

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
      ctx.apiSuccess(retData);
    } catch (error) {
      console.log('controller---test---失败');
      ctx.apiError('test失败');
    }
  }
}
