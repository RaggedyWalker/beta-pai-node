import Koa from 'koa';
import json from 'koa-json';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import koa_static from 'koa-static';
import cors from '@koa/cors';
import routers from './routes';
import errorHandler from './middleware/errorHandler.ts';
import responseHandler from './middleware/responseHandler.ts';

const app = new Koa();

// middlewares
app.use(cors());
app.use(logger());
// error handler
app.use(errorHandler);
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
// app.use(json());
app.use(koa_static(__dirname + '/public'));
// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date().getTime() - start.getTime();
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
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
