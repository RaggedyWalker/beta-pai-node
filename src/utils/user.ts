import { User } from '@prisma/client';
import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export default {
  getCurrentUser(ctx: Context): User {
    return ctx.state.user || {};
  },

  getUserToken(user: User): string {
    const token = jwt.sign(
      user,
      JWT_SECRET, // secret
      { expiresIn: 3 * 60 * 60 } // 60 * 60 s
    );
    return token;
  }
};
