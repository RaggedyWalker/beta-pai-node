const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Shanghai');

class StockStrategy {
  constructor(obj={}) {
    dayjs.extend(utc);
    this.id = obj.id;
    this.stockCode = obj.stockCode;
    this.stockName = obj.stockName;
    this.comment = obj.comment;
    // this.createTime = obj.createTime || dayjs().utc().local().format();
    this.confidenceGrade = obj.confidenceGrade;
    this.goalPrice = obj.goalPrice;
    this.userName = obj.userName;
    // console.log(this.createTime);
  }
}

module.exports = StockStrategy;
