import { BusinessError } from './../exceptions/errors';
import { Context, Next } from 'koa';
import CryptoJS, { MD5 } from 'crypto-js';
import db from '../utils/db';
import Utils from '../utils';
import { sendMail } from '../utils/mail';
import { INVITE_KEY } from '../config';
import { ApplyStatus } from '@prisma/client';
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
    const userReq = ctx.request.body as {
      userName: string;
      password: string;
      email?: string;
      phone?: string;
    };
    await checkUserExist(userReq);
    const user = await registryService(userReq);
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
   * 校验：是否申请过，是否存在该用户
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
    const searchBody: {
      userName: string;
      email?: string;
      phone?: string;
    } = {
      userName
    };
    email && (searchBody.email = email);
    phone && (searchBody.phone = phone);
    await checkApplyExist(searchBody);
    await checkUserExist(searchBody);
    const pwd = CryptoJS.MD5(userName + email + phone)
      .toString()
      .substring(0, 12);
    if (inviteKey) {
      if (inviteKey === INVITE_KEY) {
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
      try {
        await db.accountApplication.create({
          data: {
            userName,
            origin: pwd,
            email,
            phone,
            inviteKey,
            reason
          }
        });
        await sendMail({
          subject: '【来自betaeye的消息】用户账号申请',
          html: `
          <div style="padding: 1rem 2rem;">
            <h1>账号申请</h1>
            <p>用户名：${userName}</p>
            <p>邮箱：${email}</p>
            <p>手机号：${phone}</p>
            <p>申请原因：${reason}</p>
            <p>邀请码：${inviteKey ? inviteKey + '✅' : ''} </p>
            <p>生成密码：${pwd} </p>
            <div><a href="https://betaeye.top/eye/background" target="_blank">前往验证</a></div>
          </div>
        `
        });
        ctx.body = {
          message: '申请成功，请耐心等待审核通过邮件通知'
        };
        next();
      } catch (e) {
        console.error(e);
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
    await checkUserExist({
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

  static async info(ctx: Context, next: Next) {
    const user = Utils.user.getCurrentUser(ctx);
    ctx.body = {
      id: user.id,
      userName: user.userName,
      role: user.role,
      email: user.email,
      phone: user.phone
    };
    next();
  }

  static async getAccountApplicationList(ctx: Context, next: Next) {
    const { userName } = ctx.request.body as {
      userName?: string;
    };
    const list = await db.accountApplication.findMany({
      where: {
        userName: userName,
        applyStatus: ApplyStatus.PENDING
      },
      orderBy: {
        createDate: 'desc'
      }
    });
    ctx.body = list.map(item => ({
      userName: item.userName,
      reason: item.reason,
      id: item.id,
      createDate: item.createDate
    }));
    next();
  }

  static async approveAccountApplication(ctx: Context, next: Next) {
    const { id } = ctx.request.body as {
      id: number;
    };
    const result = await db.accountApplication.findUnique({
      where: {
        id
      }
    });
    if (result && result.email) {
      await registryService({
        userName: result.userName,
        password: result.origin,
        email: result.email,
        phone: result.phone || undefined
      });
      await db.accountApplication.update({
        where: {
          id
        },
        data: {
          applyStatus: ApplyStatus.RESOLVE
        }
      });
      await sendMail({
        to: result.email,
        subject: '【来自betaeye的消息】账号申请通过',
        html: `
        <div style="padding: 1rem 2rem;">
          <h1>账号申请通过</h1>
          <p>申请账号：${result.userName}</p>
          <p>请保存您的初始登录密码：${result.origin}</p>
        </div>
      `
      });
    }
    ctx.body = result;
    next();
  }

  static async rejectAccountApplication(ctx: Context, next: Next) {
    const { id, reason = '申请理由未通过' } = ctx.request.body as {
      id: number;
      reason?: string;
    };
    const result = await db.accountApplication.update({
      where: {
        id
      },
      data: {
        applyStatus: ApplyStatus.REJECT
      }
    });
    if (result.email) {
      await sendMail({
        to: result.email,
        subject: '【来自betaeye的消息】账号申请未通过',
        html: `
        <div style="padding: 1rem 2rem;">
          <h1>账号申请未通过</h1>
          <p>申请账号：${result.userName}</p>
          <p>拒绝理由：${reason}</p>
        </div>
      `
      });
    }
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
 * 校验用户是否存在
 * @param userReq
 * @returns
 */
async function checkUserExist(userReq: {
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

async function checkApplyExist(userReq: {
  userName: string;
  email?: string;
  phone?: string;
}) {
  const OR: { [key: string]: string | undefined }[] = [];
  Object.entries(userReq).map(([key, value]) => {
    if (value) {
      OR.push({
        [key]: value
      });
    }
  });
  console.log(OR);

  const existedApply = await db.accountApplication.findFirst({
    where: {
      OR
    }
  });
  console.log(existedApply);

  if (existedApply) {
    throw new Error('该账户已经申请过');
  }
}

function decryptoPassword(password: string) {
  const secretKey = 'beta_secret_key';
  return CryptoJS.AES.decrypt(password, secretKey).toString(CryptoJS.enc.Utf8);
}
