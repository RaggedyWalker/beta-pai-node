import Router from '@koa/router';
import stockController from '../controller/stockController';

const router = new Router({
  prefix: '/stock'
});
router.allowedMethods();
router.post('/dayL', stockController.getDayLine);
export default router;
