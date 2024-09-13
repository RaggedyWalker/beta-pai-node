import { Context, Next } from 'koa';
import db from '../utils/db';
class TrainController {
  /**
   * 根据参数生成训练设置
   * @param ctx
   * @param next
   */
  public static async init(ctx: Context, next: Next): Promise<void> {
    const requestBody = ctx.request.body as {
      stockCode?: string;
      startDate?: number;
      period: number;
      blind: boolean;
      revealTime: boolean;
    };
    const config = {
      stockCode: '',
      startDate: 0,
      period: requestBody.period,
      blind: requestBody.blind,
      revealTime: requestBody.revealTime
    };
    if (requestBody.blind) {
      const count = await db.stock.count();
      const index = Math.round(Math.random() * count);
      const randomStock = await db.stock.findMany({ skip: index, take: 1 });
      config.stockCode = randomStock[0].stockCode;
      config.startDate = await getRandomStartDate(
        config.stockCode,
        requestBody.period
      );
    } else {
      config.stockCode = requestBody.stockCode as string;
      if (requestBody.startDate) {
        config.startDate = requestBody.startDate;
      } else {
        config.startDate = await getRandomStartDate(
          config.stockCode,
          requestBody.period
        );
      }
    }
    ctx.body = config;
    await next();
  }
}

export default TrainController;

/**
 * 根据股票和周期获取随机开始日期
 * @param stockCode
 * @param period
 * @returns
 */
async function getRandomStartDate(stockCode: string, period: number) {
  const klines = await db.stockDayLine.findMany({
    where: {
      code: stockCode
    },
    orderBy: {
      timestamp: 'asc'
    }
  });
  const _start = 0;
  const _end = klines.length - 1 - period;
  console.log(Math.round(Math.random() * (_end - _start)));
  return klines[
    Math.round(Math.random() * (_end - _start))
  ].timestamp.getTime();
}
