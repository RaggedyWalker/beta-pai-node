import { EnumList } from '../types/utils';
import * as Enums from '../enums';

export const confidenceGradeEnumList: EnumList = [
  { label: '确定', value: Enums.ConfidenceGradeEnum.CONFIRM },
  { label: '强', value: Enums.ConfidenceGradeEnum.STRONG },
  { label: '中', value: Enums.ConfidenceGradeEnum.MEDIUM },
  { label: '弱', value: Enums.ConfidenceGradeEnum.WEAK }
];

export const predictTrendEnumList: EnumList = [
  { label: '上涨', value: Enums.PredictTrendEnum.UP },
  { label: '下跌', value: Enums.PredictTrendEnum.DOWN },
  { label: '震荡', value: Enums.PredictTrendEnum.SHOCK },
  { label: '反弹', value: Enums.PredictTrendEnum.REBOUND },
  { label: '反转', value: Enums.PredictTrendEnum.REVERSAL }
];
