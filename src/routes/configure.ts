import Router from '@koa/router';
import configureController from '../controller/configureController';

const router = new Router({
  prefix: '/configure'
});
router.allowedMethods();
router.get('/', configureController.get);
router.routes();
export default router;
