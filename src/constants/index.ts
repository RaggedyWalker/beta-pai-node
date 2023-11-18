import { EnumList } from '../types/utils';

export enum ConfidenceGradeEnum {
  CONFIRM = 1,
  STRONG = 2,
  MEDIUM = 3,
  WEAK = 4
}

export const ConfidenceGrade: EnumList = [
  { label: '确定', value: ConfidenceGradeEnum.CONFIRM },
  { label: '强', value: ConfidenceGradeEnum.STRONG },
  { label: '中', value: ConfidenceGradeEnum.MEDIUM },
  { label: '弱', value: ConfidenceGradeEnum.WEAK }
];
