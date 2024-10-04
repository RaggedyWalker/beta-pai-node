import { Context, Next } from 'koa';
import db from '../utils/db';
import { BusinessError } from '../exceptions/errors';
import Utils from '../utils';
import dayjs from 'dayjs';
// import JSONBig from 'json-bigint';

class TrainController {
  /**
   * 根据参数生成训练设置
   * @param ctx
   * @param next
   */
  public static async init(ctx: Context, next: Next): Promise<void> {
    const requestBody = ctx.request.body as {
      stockName?: string;
      stockCode?: string;
      startDate?: number;
      period: number;
      blind: boolean;
      revealTime: boolean;
    };
    const config = {
      stockName: '',
      stockCode: '',
      startDate: -1,
      period: requestBody.period,
      blind: requestBody.blind,
      revealTime: requestBody.revealTime
    };
    if (requestBody.blind) {
      const count = await db.stock.count();
      while (config.startDate < 0) {
        const index = Math.round(Math.random() * count);
        const result = await db.stock.findMany({ skip: index, take: 1 });
        config.stockName = result[0].stockName;
        config.stockCode = result[0].stockCode;
        config.startDate = await getRandomStartDate(
          result[0].stockCode,
          requestBody.period
        );
      }
    } else {
      config.stockName = requestBody.stockName as string;
      config.stockCode = requestBody.stockCode as string;
      if (requestBody.startDate) {
        config.startDate = requestBody.startDate;
        const klines = await db.stockDayLine.findMany({
          where: {
            code: config.stockCode
          },
          orderBy: {
            timestamp: 'asc'
          }
        });
        const index = klines.findIndex(
          item => config.startDate <= item.timestamp.getTime()
        );
        if (klines.length - 1 - index < requestBody.period) {
          throw new BusinessError(
            '所选周期大于股票存在时间，请重新选择股票或者周期'
          );
        }
      } else {
        config.startDate = await getRandomStartDate(
          config.stockCode,
          requestBody.period
        );
        if (config.startDate < 0) {
          throw new BusinessError(
            '所选周期大于股票存在时间，请重新选择股票或者周期'
          );
        }
      }
    }
    try {
      const user = Utils.user.getCurrentUser(ctx);
      const record = await db.stockTrainRecord.create({
        data: {
          name: config.stockName,
          code: config.stockCode,
          startDate: new Date(config.startDate),
          period: config.period,
          blind: config.blind,
          userId: user.id
        }
      });
      ctx.body = { ...config, id: record.id };
    } catch (error) {
      throw new BusinessError((error as Error).message);
    }
    await next();
  }

  static async getTrainData(ctx: Context, next: Next): Promise<void> {
    const user = Utils.user.getCurrentUser(ctx);
    const id = ctx.query.id;
    const record = await db.stockTrainRecord.findFirst({
      where: {
        id: Number(id),
        userId: user.id
      }
    });
    if (!record) {
      throw new BusinessError('训练记录不存在');
    }
    const startDate = dayjs(record.startDate).subtract(300, 'day');
    const endDate = dayjs(record.startDate).add(record.period, 'day');
    const klines = await db.stockDayLine.findMany({
      where: {
        AND: {
          code: record.code,
          timestamp: {
            lt: endDate.toDate(),
            gt: startDate.toDate()
          }
        }
      }
    });
    ctx.body = {
      config: record,
      data: klines.map(item => ({
        ...item,
        volume: item.volume.toString()
        // timestamp: item.timestamp.getTime()
      }))
    };
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
  if (_end < 0) {
    return -1;
  }
  console.log(Math.round(Math.random() * (_end - _start)));
  return klines[
    Math.round(Math.random() * (_end - _start))
  ].timestamp.getTime();
}
