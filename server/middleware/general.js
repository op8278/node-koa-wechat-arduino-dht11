import koaBody from 'koa-bodyparser';
import koaSession from 'koa-session';
// 应用koa-bodyparser中间件 => ctx.request.body
export const addBody = app => {
  app.use(koaBody());
};
// 应用koa-session中间件 => ctx.session
export const addSession = app => {
  app.keys = ['hdt11'];
  app.use(
    koaSession(
      {
        key: 'koa:sess' /** (string) cookie key (default is koa:sess) */,
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        overwrite: true /** (boolean) can overwrite or not (default true) */,
        httpOnly: true /** (boolean) httpOnly or not (default true) */,
        signed: true /** (boolean) signed or not (default true) */,
        rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/,
      },
      app
    )
  );
};
// 拓展API接口
export const extendAPIFunc = app => {
  app.use(async (ctx, next) => {
    ctx.apiSuccess = data => {
      ctx.body = {
        success: true,
        data: data,
      };
    };
    ctx.apiError = err => {
      ctx.body = {
        success: false,
        err: err || 'unknown error',
      };
    };
    await next();
  });
};
