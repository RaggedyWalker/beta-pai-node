import { Context, Next } from 'koa';
const authHandler = async (ctx: Context, next: Next) => {
  await next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401000,
        message: '登录状态失效'
      };
    } else {
      throw err;
    }
  });
};

export default authHandler;
