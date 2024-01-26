import Router from '@koa/router';
import sourceDataController from '../controller/sourceDataController.ts';

const router = new Router({
  prefix: '/source'
});
router.allowedMethods();
router.post('/api', sourceDataController.get);
router.get('/stock/search', sourceDataController.searchStock);
export default router;
