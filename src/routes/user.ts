import Router from '@koa/router';
import UserController from '../controller/userController';

const router = new Router({ prefix: '/user' });
router.allowedMethods();
router.post('/login', UserController.login);
router.post('/registry', UserController.registry);
router.post('/signOut', UserController.signOut);
router.post('/applyForAccount', UserController.applyForAccount);
router.post('/checkIfUserExist', UserController.checkIfUserExist);
router.post('/resetpw', UserController.resetpw);

router.routes();

export default router;
