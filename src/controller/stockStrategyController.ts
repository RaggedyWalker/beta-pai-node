import StockStrategy from '../entity/StockStrategy';
import { Context, Next } from 'koa';
import { StrategyProperties } from '../types/entity';
import db from '../utils/db';
import { confidenceGradeEnumList, predictTrendEnumList } from '../constants';
import { StrategyPropertiesResponse } from '../types/response';
import { Page } from '../entity/common';

interface StockStrategyQuery {
  currentPage: number;
  pageSize: number;
}

class StockStrategyController {
  /**
   * Retrieves a stock prediction from the database.
   *
   * @param {Object} ctx - The context object representing the request and response of the server.
   * @param {Function} next - The callback function to invoke after retrieving the stock prediction.
   * @returns {Promise} A promise that resolves to void.
   */
  public static async get(ctx: Context, next: Next): Promise<void> {
    ctx.body = await db.stockPredict.findUnique({
      where: { id: Number(ctx.query.id) }
    });
    await next();
  }
  /**
   * Add a new stock prediction record to the database.
   *
   * @param {Context} ctx - The Koa context object.
   * @param {Next} next - The next middleware function.
   * @return {Promise<void>} - A Promise that resolves when the operation is complete.
   */
  public static async add(ctx: Context, next: Next): Promise<void> {
    const data = new StockStrategy(ctx.request.body as StrategyProperties);
    // data.goalPrice = new Prisma.Decimal(data.goalPrice);
    const user = await db.stockPredict.create({
      data
    });
    console.log('result:', user);
    // 新增记录
    ctx.body = '新增记录';
    await next();
  }

  /**
   * Delete a stock strategy record.
   *
   * @param {Context} ctx - The Koa context object.
   * @param {Next} next - The next middleware function.
   * @returns {Promise<void>} - A Promise that resolves when the record is deleted successfully.
   */
  public static async delete(ctx: Context, next: Next): Promise<void> {
    const id = (ctx.request.body as StrategyProperties).id;
    const user = await db.stockPredict.update({
      where: {
        id: Number(id)
      },
      data: {
        status: false
      }
    });
    console.log('删除记录:', user);
    // 新增记录
    ctx.body = '删除记录';
    await next();
  }

  /**
   * Updates a stock strategy record with new data.
   *
   * @param {Context} ctx - The Koa context object.
   * @param {Next} next - The next middleware function.
   * @return {Promise<void>} A promise that resolves when the update is complete.
   */
  public static async update(ctx: Context, next: Next): Promise<void> {
    const data = new StockStrategy(ctx.request.body as StrategyProperties);
    const record = await db.stockPredict.update({
      where: {
        id: data.id
      },
      data
    });
    console.log('更新记录:', record);
    // 新增记录
    ctx.body = record;
    await next();
  }

  /**
   * Retrieves a page of stock prediction strategies.
   *
   * @param {Context} ctx - The Koa context object.
   * @param {Next} next - The Koa next function.
   * @return {Promise<void>}
   */
  public static async getPage(ctx: Context, next: Next): Promise<void> {
    const { pageSize, currentPage } = ctx.request.body as StockStrategyQuery;
    const total = await db.stockPredict.count({});
    const page: Page<StrategyPropertiesResponse> =
      new Page<StrategyPropertiesResponse>();
    if (total > 0) {
      const list = await db.stockPredict.findMany({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        orderBy: {
          createTime: 'desc'
        }
      });
      const processedList = list.map(item => ({
        ...item,
        confidenceGradeText: confidenceGradeEnumList.find(
          obj => obj.value === item.confidenceGrade
        )?.label,
        predictTrendText: predictTrendEnumList.find(
          obj => obj.value === item.predictTrend
        )?.label,
        goalPrice: item.goalPrice.toNumber()
      }));
      page.total = total;
      page.pageSize = pageSize;
      page.currentPage = currentPage;
      page.list = processedList;
    }
    ctx.body = page;
    await next();
  }
}

export default StockStrategyController;
