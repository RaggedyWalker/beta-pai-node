import { Context } from 'koa';
import { ConfidenceGradeEnumList } from '../constants';

class ConfigureController {
  public static async get(ctx: Context): Promise<void> {
    const { type } = ctx.query;
    if (type === 'confidenceGrade') {
      ctx.body = ConfidenceGradeEnumList;
    }
  }
}

export default ConfigureController;
