import db from '../utils/db.ts';
import dayjs from 'dayjs';
import akShareService from '../externalService/akShareService.ts';
import { FetchResult } from '../types/utils.ts';

type Stock = {
  stockName: string;
  stockCode: string;
  market: string;
};

/**
 *  更新所有股票日线数据
 *
 * @description
 * 对于没有日线数据的股票，保存全量数据。如果已有数据，则从最新日期开始更新数据。
 *
 * 对于保存失败的股票，进入重试队列，稍后进入重试队列。
 * @param stockList
 */
async function updateALLStockDayLine(stockList: Stock[]) {
  const failStockList: Stock[] = [];
  const len = stockList.length;
  for (let i = 0; i < len; i++) {
    const stock = stockList[i];
    try {
      await updateStockDayLine(stock);
      console.log(`update stockDayLine: ${i + 1} /${len}`);
    } catch (e) {
      failStockList.push(stock);
    }
  }

  const failLen = failStockList.length;
  if (failLen > 0) {
    console.log('retry update stockDayLine');
    for (let i = 0; i < failLen; i++) {
      const stock = failStockList[i];
      try {
        await updateStockDayLine(stock);
        console.log(`update stockDayLine: ${i + 1} /${len}`);
      } catch (e) {
        console.error(`retry update stockDayLine fail: ${stock.stockCode}`);
        console.error('reason: ', e);
      }
    }
  }
}

/**
 * 更新股票日线数据
 * @param stock
 */
async function updateStockDayLine(stock: Stock) {
  const { stockCode } = stock;
  const result = await db.stockDayLine.findFirst({
    where: {
      code: stockCode
    },
    orderBy: {
      time: 'desc'
    }
  });
  // 用数据库中的已有最新日期t+1为开始时间
  const startDate = result
    ? dayjs(result.time).add(1, 'day').format('YYYYMMDD')
    : null;
  const list = await akShareService('stock_zh_a_hist', {
    symbol: stockCode,
    period: 'daily',
    adjust: 'qfq',
    start_date: startDate
  });
  await db.stockDayLine.createMany({
    data: formatStockList(stockCode, list.data as FetchResult[])
  });
}
function formatStockList(stockCode: string, list: FetchResult[]) {
  return list.map(item => {
    const time = new Date(item['日期']);
    return {
      code: stockCode,
      time,
      open: item['开盘'] as number,
      close: item['收盘'] as number,
      high: item['最高'] as number,
      low: item['最低'] as number,
      volume: item['成交量'] as number,
      amount: item['成交额'] as number,
      growthPct: item['涨跌幅'] as number,
      ampPct: item['振幅'] as number
    };
  });
}

export default { updateALLStockDayLine };
