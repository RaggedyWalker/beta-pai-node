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
router.get('/info', UserController.info);
router.post('/account/applyList', UserController.getAccountApplicationList);
router.post('/account/approve', UserController.approveAccountApplication);
router.post('/account/reject', UserController.rejectAccountApplication);
router.routes();

export default router;
