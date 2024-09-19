import { Context } from 'koa';

export default {
  getCurrentUser(ctx: Context) {
    return ctx.state.user || {};
  }
};
