import { ConfidenceGradeEnum, PredictTrendEnum } from '../enums';

export interface StrategyProperties {
  id: number;
  stockCode: string;
  stockName: string | null;
  comment: string | null;
  confidenceGrade: ConfidenceGradeEnum | null;
  goalPrice: string | null;
  userName: string | null;
  predictTrend: PredictTrendEnum | null;
  status: boolean;
  createTime: Date | null;
}
