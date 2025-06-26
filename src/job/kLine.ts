import db from '../utils/db';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';
import Bottleneck from 'bottleneck';
import { queryHistoryKline } from '../service/stock';

type Stock = {
  stockName: string;
  stockCode: string;
  market: string;
};

let stockUpdateList: Prisma.StockUpdateStatusCreateInput[] = [];

const max = 199;
const limiter = new Bottleneck({
  maxConcurrent: 1,
  reservoir: max, // 每分钟最多可用令牌数
  reservoirRefreshAmount: max,
  reservoirRefreshInterval: 60 * 1000 // 每分钟重置
});

/**
 * 更新一个股票日线数据
 * @param stock
 */
async function updateStockDayLine(stock: Stock) {
  const { stockCode, market } = stock;
  const status = stockUpdateList.find(item => item.code === stockCode);
  console.log(stockCode, ': ', status?.updateTime || 'no update history');
  // 用数据库中的已有最新日期t+1为开始时间
  const startDate = status
    ? dayjs(status.updateTime).add(1, 'day').format('YYYY-MM-DD')
    : dayjs('2005-01-01').format('YYYY-MM-DD');
  const list = await queryHistoryKline(
    [market, stockCode].join('.'),
    startDate
  );
  if (list.length > 0) {
    const chunk = 400;
    const insert = [];
    for (let i = 0; i < list.length; i += chunk) {
      const subList = list.slice(i, i + chunk);
      insert.push(
        db.stockDayLine.createMany({
          data: subList
        })
      );
    }
    const upsert = db.stockUpdateStatus.upsert({
      where: {
        code: stockCode
      },
      update: {
        updateTime: new Date()
      },
      create: {
        code: stockCode,
        updateTime: new Date()
      }
    });
    await db.$transaction([...insert, upsert]);
    console.log('insert successfully');
  }
}

// function formatStockList(stockCode: string, list: FetchResult[]) {
//   // 时间转换，因为aktool返回的是utc时间
//   const offset = new Date().getTimezoneOffset() * 60 * 1000;
//   return list.map(item => {
//     const timestamp = new Date(new Date(item['日期']).getTime() - offset);
//     return {
//       code: stockCode,
//       timestamp,
//       open: item['开盘'] as number,
//       close: item['收盘'] as number,
//       high: item['最高'] as number,
//       low: item['最低'] as number,
//       volume: item['成交量'] as number,
//       amount: item['成交额'] as number,
//       growthPct: item['涨跌幅'] as number,
//       ampPct: item['振幅'] as number
//     };
//   });
// }

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

  stockUpdateList = await db.stockUpdateStatus.findMany();

  for (let i = 0; i < total; i = i + step) {
    const subStockList = stockList.slice(i, i + step);
    await batchUpdateStockDayLine(subStockList);
  }

  async function batchUpdateStockDayLine(stockList: Stock[]) {
    const promises = stockList.map(limiter.wrap(update));
    await Promise.allSettled(promises);
    // const currentLength = stockData.length;
    // console.log('current stock data length: ', currentLength);
    // if (currentLength >= 1 * 10000) {
    //   const slice = 1000;
    //   const tranJob = [];
    //   for (let i = 0; i < currentLength; i += slice) {
    //     tranJob.push(
    //       db.stockDayLine.createMany({
    //         data: stockData.slice(i, i + slice)
    //       })
    //     );
    //   }
    //   db.$transaction(tranJob);
    //   stockData.length = 0;
    //   console.log('batch insert stockDayLine length: ', currentLength);
    // }
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
