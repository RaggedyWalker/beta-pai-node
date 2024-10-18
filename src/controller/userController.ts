import { BusinessError } from './../exceptions/errors';
import { Context, Next } from 'koa';
import CryptoJS, { MD5 } from 'crypto-js';
import db from '../utils/db';
import Utils from '../utils';
import { sendMail } from '../utils/mail';
import { INVITE_KEY } from '../config';
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
    const { userName, password } = ctx.request.body as {
      userName: string;
      password: string;
    };
    if (!userName || !password) {
      throw new Error('参数不合法');
    }
    const decodedPassword = decryptoPassword(password);

    const user = await db.user.findFirst({
      where: {
        OR: [{ userName }, { email: userName }]
      }
    });

    if (!user) {
      throw new Error('用户不存在');
    }
    if (user.password !== MD5(decodedPassword).toString()) {
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
    const user = await registryService(
      ctx.request.body as {
        userName: string;
        password: string;
        email?: string;
        phone?: string;
      }
    );
    ctx.body = user;
    await next();
  }

  /**
   * 注销
   * @param ctx
   * @param next
   */
  static async signOut(ctx: Context, next: Next): Promise<void> {
    // todo
    await next();
  }

  /**
   * 申请账号
   * 有邀请码直接通过程序创建用户
   * 没有邀请码需要发送邮件人工审核，
   * @param ctx
   * @param next
   */
  static async applyForAccount(ctx: Context, next: Next) {
    const {
      userName,
      email = '',
      phone = '',
      reason,
      inviteKey = ''
    } = ctx.request.body as {
      userName: string;
      email?: string;
      phone?: string;
      reason: string;
      inviteKey?: string;
    };
    const pwd = CryptoJS.MD5(userName + email + phone)
      .toString()
      .substring(0, 12);
    if (inviteKey !== undefined) {
      if (inviteKey === INVITE_KEY) {
        // 创建用户
        await registryService({
          userName,
          password: pwd,
          email,
          phone
        });
        ctx.body = {
          message: `申请成功, ${userName}, 您的初始登录密码为${pwd}`
        };
        next();
      } else {
        throw new BusinessError('邀请码不正确');
      }
    } else {
      await checkUserReq({
        userName,
        email,
        phone
      });
      try {
        await sendMail({
          subject: '【来自betaeye的消息】用户账号申请',
          html: `
          <div>
            <h1>账号申请</h1>
            <p>用户名：${userName}</p>
            <p>邮箱：${email}</p>
            <p>手机号：${phone}</p>
            <p>申请原因：${reason}</p>
            <p>邀请码：${inviteKey ? inviteKey + '✅' : ''} </p>
            <p>生成密码：${pwd} </p>
          </div>
        `
        });
        ctx.body = {
          message: `申请成功, 请保存您的初始登录密码：${pwd}，请耐心等待审核通过`
        };
        next();
      } catch (e) {
        throw new BusinessError('账号申请失败，请过一段时间重试');
      }
    }
  }

  static async checkIfUserExist(ctx: Context, next: Next) {
    const {
      userName,
      email = '',
      phone = ''
    } = ctx.request.body as {
      userName: string;
      email?: string;
      phone?: string;
    };
    await checkUserReq({
      userName,
      email,
      phone
    });
    ctx.body = {
      result: true
    };
    next();
  }

  static async resetpw(ctx: Context, next: Next) {
    const { userName, oldpw, newpw } = ctx.request.body as {
      userName: string;
      oldpw: string;
      newpw: string;
    };

    const user = await db.user.findFirst({
      where: {
        userName
      }
    });

    if (!user) {
      throw new Error('用户名不存在');
    }
    if (user.password !== MD5(oldpw).toString()) {
      throw new Error('旧密码错误');
    }
    const result = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        password: MD5(newpw).toString()
      }
    });
    ctx.body = result;
    next();
  }
}

export default UserController;

/**
 * 注册用户
 * @param userReq
 * @returns
 */
async function registryService(userReq: {
  userName: string;
  password: string;
  email?: string;
  phone?: string;
}) {
  const { userName, password, email, phone } = userReq;
  await checkUserReq(userReq);
  if (!password) {
    throw new Error('用户密码不能为空');
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
  return user;
}

/**
 * 校验用户信息
 * @param userReq
 * @returns
 */
async function checkUserReq(userReq: {
  userName: string;
  email?: string;
  phone?: string;
}) {
  const { userName, email, phone } = userReq;
  if (!userName || userName.toUpperCase() === 'NULL') {
    throw new Error('注册参数不合法');
  }
  const result = await db.user.findFirst({
    where: {
      OR: [
        {
          userName
        },
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
    if (result.userName === userName) {
      throw new Error('用户名已存在');
    }
    throw new Error('用户已存在');
  }
  return result;
}

function decryptoPassword(password: string) {
  const secretKey = 'beta_secret_key';
  return CryptoJS.AES.decrypt(password, secretKey).toString(CryptoJS.enc.Utf8);
}
