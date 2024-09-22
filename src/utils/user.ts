import { User } from '@prisma/client';
import { Context } from 'koa';

export default {
  getCurrentUser(ctx: Context): User {
    return ctx.state.user || {};
  }
};
