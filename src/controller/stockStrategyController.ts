import StockStrategy from '../entity/StockStrategy';
import { Context } from 'koa';
import { PrismaClient } from '@prisma/client';
import { StrategyProperties } from '../types/entity';

const prisma = new PrismaClient();

class StockStrategyController {
  public static async get(ctx: Context): Promise<void> {
    // 新增记录
    // const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log(zone);
    // const date = new Date().toLocaleString('english', {
    //   hour12:false,
    //   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    // });
    // console.log(date);
    ctx.body = await prisma.stockPredict.findUnique({
      where: { id: Number(ctx.query.id) }
    });
  }
  /**
   * Add a new stock prediction record to the database.
   *
   * @param {Context} ctx - The Koa context object.
   * @return {Promise<void>} - A Promise that resolves when the operation is complete.
   */
  public static async add(ctx: Context): Promise<void> {
    const data = new StockStrategy(ctx.request.body as StrategyProperties);
    const user = await prisma.stockPredict.create({
      data
    });
    console.log('result:', user);
    // 新增记录
    ctx.body = '新增记录';
  }

  /**
   * Delete a stock strategy record.
   *
   * @param {Context} ctx - The Koa context object.
   * @returns {Promise<void>} - A Promise that resolves when the record is deleted successfully.
   */
  public static async delete(ctx: Context): Promise<void> {
    const id = (ctx.request.body as StrategyProperties).id;
    const user = await prisma.stockPredict.update({
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
  }

  /**
   * Updates a stock strategy record with new data.
   *
   * @param {Context} ctx - The Koa context object.
   * @return {Promise<void>} A promise that resolves when the update is complete.
   */
  public static async update(ctx: Context): Promise<void> {
    const data = new StockStrategy(ctx.request.body as StrategyProperties);
    const user = await prisma.stockPredict.update({
      where: {
        id: data.id
      },
      data
    });
    console.log('更新记录:', user);
    // 新增记录
    ctx.body = user;
  }
}

export default StockStrategyController;
