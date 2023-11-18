import { Context, Next } from 'koa';

const responseHandler = async (ctx: Context, next: Next) => {
  if (ctx.body) {
    ctx.body = {
      code: 200,
      message: 'success',
      data: ctx.body
    };
  }
  await next();
};
export default responseHandler;
