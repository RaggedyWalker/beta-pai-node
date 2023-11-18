import StockStrategy from '../entity/StockStrategy';
import { Context, Next } from 'koa';
import { StrategyProperties } from '../types/entity';
import db from '../utils/db.ts';

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
    const user = await db.stockPredict.update({
      where: {
        id: data.id
      },
      data
    });
    console.log('更新记录:', user);
    // 新增记录
    ctx.body = user;
    await next();
  }
}

export default StockStrategyController;
