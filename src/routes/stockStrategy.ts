import Router from '@koa/router';
import stockStrategyController from '../controller/stockStrategyController';

const router = new Router({
  prefix: '/strategy/predict'
});
router.allowedMethods();
router.get('/', stockStrategyController.get);
router.post('/add', stockStrategyController.add);
router.post('/delete', stockStrategyController.delete);
router.post('/update', stockStrategyController.update);
router.post('/getPage', stockStrategyController.getPage);
router.routes();
export default router;
