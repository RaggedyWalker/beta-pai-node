import { Context, Next } from 'koa';
import akShareService from '../externalService/akShareService.ts';
import { ExternalRequestError } from '../exceptions/errors.ts';

class StockStrategyController {
  /**
   * Retrieves data from the specified URL using akShareService.
   *
   * @param {Context} ctx - The Koa context object.
   * @param {Next} next - The next middleware function.
   *
   * @return {Promise<void>} - A promise that resolves once the data is retrieved.
   */
  public static async get(ctx: Context, next: Next): Promise<void> {
    const { url, params } = ctx.request.body as Record<string, unknown>;
    try {
      const data = await akShareService(url as string, params);
      ctx.body = data.data;
      await next();
    } catch (e) {
      throw new ExternalRequestError((e as Error).message);
    }
  }
}

export default StockStrategyController;
