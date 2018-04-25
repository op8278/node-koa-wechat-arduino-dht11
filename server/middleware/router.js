import { resolve } from 'path';
import { Route } from '../decorator/router';

export const router = app => {
  // 拿到保存router的路径
  const routerPath = resolve(__dirname, '../controller');
  const route = new Route(app, routerPath);
  // 开始加载路由
  route.init();
};
