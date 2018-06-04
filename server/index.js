import Koa from 'koa';
import R from 'ramda';
import { resolve } from 'path';
import config from 'config';

const host = process.env.HOST || config.server.host;
const port = process.env.PORT || config.server.port;
const MIDDLEWARES = ['database', 'general', 'router'];

const r = path => resolve(__dirname, path);

class Server {
  constructor() {
    this.app = new Koa();
    this.originApp = null;
    console.log('server constructor start');
    this.useMiddleWares(this.app)(MIDDLEWARES);
  }
  useMiddleWares(app) {
    return R.map(
      R.compose(
        R.map(i => i(app)),
        require,
        i => `${r('./middleware')}/${i}`
        // i => require('./middleware/' + i)
      )
    );
  }
  async start() {
    this.app.use(async (ctx, next) => {
      ctx.status = 200;
      ctx.req.session = ctx.session; // 绑定koa-session的ctx.session到ctx.req.session中
    });
    this.originApp = this.app.listen(port, () => {
      console.log(`http服务器已经启动,端口为${port}`);
    });
  }
}
const app = new Server();
app.start();

export default app;
