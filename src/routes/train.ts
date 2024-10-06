import Router from '@koa/router';
import TrainController from '../controller/trainController';

const router = new Router({
  prefix: '/train'
});
router.allowedMethods();
router.post('/init', TrainController.init);
router.get('/getTrainData', TrainController.getTrainData);
router.post('/finishTrain', TrainController.finishTrain);
router.post('/myTrainHistory', TrainController.myTrainHistory);
router.routes();
export default router;
