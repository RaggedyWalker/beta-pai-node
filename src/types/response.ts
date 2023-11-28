import { StrategyProperties } from './entity.ts';

export interface StrategyPropertiesResponse extends StrategyProperties {
  confidenceGradeText?: string;
  predictTrendText?: string;
}
