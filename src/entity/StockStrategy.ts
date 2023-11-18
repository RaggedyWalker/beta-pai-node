import { StrategyProperties } from '../types/entity';

class StockStrategy {
  public id: number;
  public stockCode: string;
  public stockName: string;
  public comment: string;
  public confidenceGrade: number;
  public goalPrice: string;
  public userName: string;

  constructor(obj: StrategyProperties) {
    this.id = obj.id;
    this.stockCode = obj.stockCode;
    this.stockName = obj.stockName;
    this.comment = obj.comment;
    this.confidenceGrade = obj.confidenceGrade;
    this.goalPrice = obj.goalPrice;
    this.userName = obj.userName;
  }
}

export default StockStrategy;
