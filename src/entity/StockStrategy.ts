import { StrategyProperties } from '../types/entity';
import { ConfidenceGradeEnum, PredictTrendEnum } from '../enums';

class StockStrategy {
  public id: number;
  public stockCode: string;
  public stockName: string;
  public comment: string;
  public confidenceGrade: ConfidenceGradeEnum;
  public goalPrice: string;
  public userName: string;
  public predictTrendEnum: PredictTrendEnum;

  constructor(obj: StrategyProperties) {
    this.id = obj.id;
    this.stockCode = obj.stockCode;
    this.stockName = obj.stockName;
    this.comment = obj.comment;
    this.confidenceGrade = obj.confidenceGrade;
    this.goalPrice = obj.goalPrice;
    this.userName = obj.userName;
    this.predictTrendEnum = obj.predictTrendEnum;
  }
}

export default StockStrategy;
