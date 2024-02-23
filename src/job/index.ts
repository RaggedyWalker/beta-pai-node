import stock from './stock.ts';
import kLine from './kLine.ts';
async function main() {
  const list = await stock.updateAllStock();
  console.log(list);

  await kLine.updateALLStockDayLine(list, 50);
}
main();

// async function createJob() {}
export default main;
