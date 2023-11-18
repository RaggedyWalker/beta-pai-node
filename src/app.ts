import Koa from 'koa';

import json from 'koa-json';

// import onerror from 'koa-onerror';

import bodyparser from 'koa-bodyparser';

import logger from 'koa-logger';

import routers from './routes';

import koa_static from 'koa-static';
import cors from '@koa/cors';

const app = new Koa();
// error handler
// onerror(app);

// middlewares
app.use(cors());
app.use(logger());
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
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

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

export default app;
