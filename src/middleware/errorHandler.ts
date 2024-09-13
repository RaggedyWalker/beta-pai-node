import { Context, Next } from 'koa';
import { BusinessError } from '../types/utils';
const errorHandler = async (ctx: Context, next: Next) => {
  await next().catch((err: Partial<BusinessError>) => {
    ctx.status = err.status || 500;
    ctx.body = {
      code: err.code || 500000,
      message: err.message
    };
    ctx.app.emit('error', err, ctx);
  });
};

export default errorHandler;
