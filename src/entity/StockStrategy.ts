import { StrategyProperties } from '../types/entity';
import { ConfidenceGradeEnum, PredictTrendEnum } from '../enums';

class StockStrategy {
  public id: number;
  public stockCode: string;
  public stockName: string | null;
  public comment: string | null;
  public confidenceGrade: ConfidenceGradeEnum | null;
  public goalPrice: string | null;
  public userName: string | null;
  public predictTrend: PredictTrendEnum | null;

  constructor(obj: StrategyProperties) {
    this.id = obj.id;
    this.stockCode = obj.stockCode;
    this.stockName = obj.stockName;
    this.comment = obj.comment;
    this.confidenceGrade = obj.confidenceGrade;
    this.goalPrice = obj.goalPrice;
    this.userName = obj.userName;
    this.predictTrend = obj.predictTrend;
  }
}

export default StockStrategy;
