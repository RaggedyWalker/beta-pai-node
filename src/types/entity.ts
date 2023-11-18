import { ConfidenceGradeEnum, PredictTrendEnum } from '../enums';

export interface StrategyProperties {
  id: number;
  stockCode: string;
  stockName: string;
  comment: string;
  confidenceGrade: ConfidenceGradeEnum;
  goalPrice: string;
  userName: string;
  predictTrendEnum: PredictTrendEnum;
}
