import { Context, Next } from 'koa';
import akShareService from '../externalService/akShareService.ts';
import { ExternalRequestError } from '../exceptions/errors.ts';
import db from '../utils/db.ts';
import JSONBig from 'json-bigint';
class StockController {
  public static async getDayLine(ctx: Context, next: Next): Promise<void> {
    const { stockCode, start, end } = ctx.request.body as {
      stockCode: string;
      start?: string;
      end?: string;
    };
    const where: { code: string; time: { gte?: Date; lte?: Date } } = {
      code: stockCode,
      time: {}
    };
    if (start) {
      where.time.gte = new Date(start);
    }
    if (end) {
      where.time.lte = new Date(end);
    }

    const data = await db.stockDayLine.findMany({
      where,
      orderBy: {
        time: 'asc'
      }
    });

    ctx.body = JSONBig.parse(JSONBig.stringify(data));
    await next();
  }
}

export default StockController;
