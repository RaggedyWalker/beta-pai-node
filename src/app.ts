import Koa from 'koa';
import koajwt from 'koa-jwt';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import koa_static from 'koa-static';
import cors from '@koa/cors';
import routers from './routes';
import errorHandler from './middleware/errorHandler';
import responseHandler from './middleware/responseHandler';
import { JWT_SECRET } from './config';
import authHandler from './middleware/authHandler';

const app = new Koa();

// middlewares
app.use(cors());
app.use(logger());
// error handler
app.use(errorHandler);
app.use(authHandler);

app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(koa_static(__dirname + '/public'));
// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date().getTime() - start.getTime();
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
// check token
app.use(
  koajwt({
    secret: JWT_SECRET
  }).unless({
    // white list
    path: [
      '/user/login',
      '/user/registry',
      '/user/applyForAccount',
      '/user/checkIfUserExist',
      '/user/resetpw'
    ] // 白名单路由
  })
);

// routes
routers.forEach(route => {
  app.use(route.routes());
});
// response handler
app.use(responseHandler);

app.on('error', err => {
  console.log(err);
});

export default app;
