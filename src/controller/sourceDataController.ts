import { Context, Next } from 'koa';
import akShareService from '../externalService/akShareService.ts';
import { ExternalRequestError } from '../exceptions/errors.ts';
import mairuiService from '../externalService/mairuiService.ts';

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
    type Stock = { dm: string; mc: string; jys: string };
    const query = ctx.request.query;
    const key = query.query as string;
    try {
      // const data = await akShareService('stock_info_a_code_name');
      const data = await mairuiService.getStockList();
      ctx.body = data.data
        .filter(
          (item: Stock) =>
            item.dm.indexOf(key) > -1 || item.mc.indexOf(key) > -1
        )
        .map((item: Stock) => ({
          stockName: item.mc,
          stockCode: item.dm + '.' + item.jys.toUpperCase()
        }));
      await next();
    } catch (e) {
      throw new ExternalRequestError((e as Error).message);
    }
  }
}

export default StockStrategyController;
