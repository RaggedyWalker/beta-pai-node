import { Context, Next } from 'koa';
import db from '../utils/db';
import JSONBig from 'json-bigint';
class StockController {
  public static async getDayLine(ctx: Context, next: Next): Promise<void> {
    const { code, start, end } = ctx.request.body as {
      code: string;
      start?: string;
      end?: string;
    };
    const where: { code: string; timestamp: { gte?: Date; lte?: Date } } = {
      code,
      timestamp: {}
    };
    if (start) {
      where.timestamp.gte = new Date(start);
    }
    if (end) {
      where.timestamp.lte = new Date(end);
    }

    const data = await db.stockDayLine.findMany({
      where,
      orderBy: {
        timestamp: 'asc'
      }
    });

    ctx.body = JSONBig.parse(
      JSONBig.stringify(
        data.map(item => ({
          ...item,
          open: item.open.toNumber(),
          close: item.close.toNumber(),
          high: item.high.toNumber(),
          low: item.low.toNumber(),
          amount: item.amount.toNumber(),
          timestamp: item.timestamp.getTime()
        }))
      )
    );
    await next();
  }
}

export default StockController;
