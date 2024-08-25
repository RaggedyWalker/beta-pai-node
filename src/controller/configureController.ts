import { Context, Next } from 'koa';
import * as constants from '../constants';
// import { objectKey } from '../types/utils.ts';
import { UndefinedConfigureError } from '../exceptions/errors';

class ConfigureController {
  public static async get(ctx: Context, next: Next): Promise<void> {
    const { type } = ctx.query;
    const key = `${type}EnumList`;
    if (Object.hasOwn(constants, key)) {
      ctx.body = (constants as Record<string, unknown>)[key];
      await next();
    } else {
      throw new UndefinedConfigureError(`未找到${key}配置枚举`);
    }
  }
}

export default ConfigureController;
