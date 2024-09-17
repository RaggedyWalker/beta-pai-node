import Router from '@koa/router';
import UserController from '../controller/userController';

const router = new Router({ prefix: '/user' });
router.allowedMethods();
router.post('/login', UserController.login);
router.post('/registry', UserController.registry);
router.post('/signOut', UserController.signOut);
router.routes();

export default router;
