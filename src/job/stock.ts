import mairuiService from '../externalService/mairuiService';
import db, { truncate } from '../utils/db';

type Stock = {
  stockName: string;
  stockCode: string;
  market: string;
};
async function updateAllStock(): Promise<Stock[]> {
  const data: { data: { dm: string; mc: string; jys: string }[] } =
    await mairuiService.getStockList();
  const list = data.data
    .filter(item => !item.mc.includes('*ST'))
    .map(item => ({
      stockName: item.mc,
      stockCode: item.dm,
      market: item.jys.toUpperCase()
    }));
  try {
    await truncate('all_stocks');
    const count = await db.stock.createMany({ data: list });
    if (!count) {
      console.log('更新失败');
      return [];
    }
  } catch (e) {
    console.error(e);
    throw e;
  }

  return list;
}

export default { updateAllStock };
