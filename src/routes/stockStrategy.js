const Router = require('koa-router');
const { PrismaClient } = require('@prisma/client');
const StockStrategy = require('../entity/StockStrategy');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
const prisma = new PrismaClient();
const router = new Router({
  prefix: '/strategy/predict'
});
router.allowedMethods();

dayjs.tz.setDefault('Asia/Shanghai');
router.post('/add', async ctx => {
  const data = new StockStrategy(ctx.request.body);
  const user = await prisma.stockPredict.create({
    data
  });
  console.log('result:', user);
  // 新增记录
  ctx.body = '新增记录';
});
router.get('/', async ctx => {
  // 新增记录
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(zone);
  const date = new Date().toLocaleString('english', {
    hour12:false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  console.log(date);
  console.log(new Date());
  dayjs.extend(utc);
  dayjs.extend(timezone);
  console.log(dayjs().utc().local().format());
  ctx.body = await prisma.stockPredict.findUnique({where:{id:Number(ctx.query.id)}});
  // ctx.body = new Date();
});

module.exports = router;
