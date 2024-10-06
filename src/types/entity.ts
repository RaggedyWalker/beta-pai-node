// import { Prisma } from '@prisma/client';
import { ConfidenceGradeEnum, PredictTrendEnum } from '../enums';

export interface StrategyProperties {
  id: number;
  stockCode: string;
  stockName: string | null;
  comment: string | null;
  confidenceGrade: ConfidenceGradeEnum | null;
  goalPrice: number;
  userName: string | null;
  predictTrend: PredictTrendEnum | null;
  status: boolean;
  createTime: Date | null;
}

export enum TransDirection {
  BUY = -1,
  SELL = 1
}

export interface Transaction {
  id?: number;
  date: string;
  price: number;
  amount: number;
  direction: TransDirection;
}
