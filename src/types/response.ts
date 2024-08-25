import { StrategyProperties } from './entity';

export interface StrategyPropertiesResponse extends StrategyProperties {
  confidenceGradeText?: string;
  predictTrendText?: string;
}
