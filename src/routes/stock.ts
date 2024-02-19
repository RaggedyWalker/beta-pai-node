import Router from '@koa/router';
import stockController from '../controller/stockController.ts';

const router = new Router({
  prefix: '/stock'
});
router.allowedMethods();
router.post('/dayL', stockController.getDayLine);
export default router;
