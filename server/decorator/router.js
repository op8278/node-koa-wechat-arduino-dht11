import Router from 'koa-router';
import glob from 'glob';
import { resolve } from 'path';
import _ from 'lodash';

export const symbolPrefix = Symbol('prefix');
export let routersMap = new Map();

export const isArray = c => (_.isArray(c) ? c : [c]);
export const normalizePath = path => (path.startsWith('/') ? path : `/${path}`);

export class Route {
  constructor(app, routerPath) {
    this.app = app;
    this.routerPath = routerPath;
    this.router = new Router();
  }
  init() {
    // 从routerPath里找到所有router文件
    // 依次加载router文件
    glob.sync(resolve(this.routerPath, './*.js')).forEach(require);
    _.forIn(routersMap, (value, key) => {
      console.log(value, key);
    });
    // 遍历routersMap
    for (let [conf, controller] of routersMap) {
      // 拿到路径
      let prefixPath = conf.target[symbolPrefix];
      if (prefixPath) prefixPath = normalizePath(prefixPath);
      const routerPath = prefixPath + conf.path;
      // 拿到controller
      const controllers = isArray(controller);
      // 装入koa-router
      this.router[conf.method](routerPath, ...controllers);
    }
    // koa使用koa-router中间件
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}

export const controller = path => target => {
  target.prototype[symbolPrefix] = path;
  return target;
};
export const assembleRouterDecorator = conf => (target, name, description) => {
  // 把相应的字段装进routersMap
  conf.path = normalizePath(conf.path);
  routersMap.set(
    {
      target: target,
      // ...conf
      method: conf.method,
      path: conf.path,
    },
    target[name]
  );
};
export const get = path =>
  assembleRouterDecorator({
    method: 'get',
    path: path,
  });
export const post = path =>
  assembleRouterDecorator({
    method: 'post',
    path: path,
  });
export const del = path =>
  assembleRouterDecorator({
    method: 'del',
    path: path,
  });
export const put = path =>
  assembleRouterDecorator({
    method: 'put',
    path: path,
  });
