import stock from './stock';
import kLine from './kLine';
async function main() {
  const list = await stock.updateAllStock();
  console.log(list);

  await kLine.updateALLStockDayLine(list, 1);
}
main();

// async function createJob() {}
export default main;
