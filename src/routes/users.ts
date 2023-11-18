import KoaRouter from '@koa/router';

const router = new KoaRouter();

router.prefix('/user');

router.get('/', function (ctx) {
  ctx.body = 'this is a users response!';
});

router.get('/bar', function (ctx) {
  ctx.body = 'this is a users/bar response';
});

export default router;
