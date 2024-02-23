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
      timestamp: 'desc'
    }
  });
  // 用数据库中的已有最新日期t+1为开始时间
  const startDate = result
    ? dayjs(result.timestamp).add(1, 'day').format('YYYYMMDD')
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
    const timestamp = new Date(item['日期']);
    return {
      code: stockCode,
      timestamp,
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

/**
 *  更新所有股票日线数据
 *
 * @description
 * 对于没有日线数据的股票，保存全量数据。如果已有数据，则从最新日期开始更新数据。
 *
 * 对于保存失败的股票，进入重试队列，稍后进入重试队列。
 * @param stockList 股票列表
 * @param step 异步任务切片的步长
 */
async function updateALLStockDayLine(stockList: Stock[], step = 10) {
  const start = Date.now();
  const total = stockList.length;
  let successCount = 0;
  const failStockList: Stock[] = [];

  for (let i = 0; i < total; i = i + step) {
    const subStockList = stockList.slice(i, i + step);
    await batchUpdateStockDayLine(subStockList);
  }

  async function batchUpdateStockDayLine(stockList: Stock[]) {
    const promises = stockList.map(stock => update(stock));
    await Promise.allSettled(promises);
  }
  async function update(stock: Stock) {
    try {
      await updateStockDayLine(stock);
      console.log(`update stockDayLine: ${++successCount} /${total}`);
    } catch (e) {
      failStockList.push(stock);
    }
  }

  // 失败重试机制
  const failLen = failStockList.length;
  if (failLen > 0) {
    console.log('retry update stockDayLine');
    for (let i = 0; i < failLen; i++) {
      const stock = failStockList[i];
      try {
        await updateStockDayLine(stock);
        console.log(`update stockDayLine: ${i + 1} /${total}`);
      } catch (e) {
        console.error(`retry update stockDayLine fail: ${stock.stockCode}`);
        console.error('reason: ', e);
      }
    }
  }
  console.log(
    '=======================\nupdate stockDayLine end \nuse time:',
    (Date.now() - start) / 1000,
    's'
  );
}

export default { updateALLStockDayLine };
