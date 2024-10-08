import { Context, Next } from 'koa';
import CryptoJS, { MD5 } from 'crypto-js';
import db from '../utils/db';
import Utils from '../utils';
/**
 * 1. 前端加密：固定salt对称加密
 * 2. 后端对称解密
 * 3. 后端将解密后的密码MD5加密之后存入数据库
 */

class UserController {
  /**
   * 登录
   * @param ctx
   * @param next
   */
  static async login(ctx: Context, next: Next): Promise<void> {
    const secretKey = 'beta_secret_key';
    const { userName, password } = ctx.request.body as {
      userName: string;
      password: string;
    };
    if (!userName || !password) {
      throw new Error('参数不合法');
    }
    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    const user = await db.user.findFirst({
      where: {
        userName
      }
    });

    if (!user) {
      throw new Error('用户不存在');
    }
    if (user.password !== MD5(decryptedPassword).toString()) {
      throw new Error('密码错误');
    }

    const token = Utils.user.getUserToken(user);
    ctx.body = {
      token,
      info: {
        id: user.id,
        userName: user.userName,
        role: user.role,
        email: user.email,
        phone: user.phone
      }
    };

    await next();
  }

  /**
   * 注册新用户
   * @param ctx
   * @param next
   */
  static async registry(ctx: Context, next: Next): Promise<void> {
    const { userName, password, email, phone } = ctx.request.body as {
      userName: string;
      password: string;
      email?: string;
      phone?: string;
    };

    if (
      userName === '' ||
      password === '' ||
      userName.toUpperCase() === 'NULL'
    ) {
      throw new Error('参数不合法');
    }
    if (email || phone) {
      const result = await db.user.findFirst({
        where: {
          OR: [
            {
              email
            },
            {
              phone
            }
          ]
        }
      });
      if (result) {
        throw new Error('用户已存在');
      }
    }
    const hashedPassword = MD5(password).toString();
    const user = await db.user.create({
      data: {
        userName,
        password: hashedPassword,
        email,
        phone
      }
    });
    ctx.body = user;
    await next();
  }

  /**
   * 注销
   * @param ctx
   * @param next
   */
  static async signOut(ctx: Context, next: Next): Promise<void> {
    await next();
  }
}

export default UserController;
