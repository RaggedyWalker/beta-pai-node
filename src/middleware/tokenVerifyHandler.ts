import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import Utils from '../utils';

// do not use
const tokenVerifyHandler = async (ctx: Context, next: Next) => {
  if (ctx.header && ctx.header.authorization) {
    const parts = ctx.header.authorization.split(' ');
    if (parts.length === 2) {
      //取出token
      const scheme = parts[0];
      const token = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          jwt.verify(token, JWT_SECRET, {
            complete: true
          });
        } catch (error) {
          //token过期 生成新的token
          const newToken = Utils.user.getUserToken(
            Utils.user.getCurrentUser(ctx)
          );

          //将新token放入Authorization中返回给前端
          ctx.res.setHeader('Authorization', newToken);
        }
      }
    }
  }
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = '登录状态失效，请重新登录';
    } else {
      throw err;
    }
  });
};

export default tokenVerifyHandler;
