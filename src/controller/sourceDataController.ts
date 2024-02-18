import { Context, Next } from 'koa';
import akShareService from '../externalService/akShareService.ts';
import { ExternalRequestError } from '../exceptions/errors.ts';
import db from '../utils/db.ts';

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

  public static async searchStock(ctx: Context, next: Next): Promise<void> {
    type Stock = {
      stockName: string;
      stockCode: string;
      market: string | null;
    };
    const query = ctx.request.query;
    const key = query.query as string;
    try {
      const data = await db.stock.findMany();
      ctx.body = data
        .filter(
          (item: Stock) =>
            item.stockCode.indexOf(key) > -1 || item.stockName.indexOf(key) > -1
        )
        .map((item: Stock) => ({
          stockName: item.stockName,
          stockCode: item.stockCode
        }));
      await next();
    } catch (e) {
      throw new ExternalRequestError((e as Error).message);
    }
  }
}

export default StockStrategyController;
