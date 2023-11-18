import Router from '@koa/router';
import { DefaultContext, DefaultState } from 'koa';

// import stockStrategy from './stockStrategy';
// import users from './users';
// import configure from './configure';
import path from 'path';
import * as fs from 'fs';

const routers: Router<DefaultState, DefaultContext>[] = [
  // stockStrategy,
  // users,
  // configure
];

// 获取routes目录
const routesPath = path.join(__dirname);
fs.readdirSync(routesPath)
  .filter(file => file !== 'index.ts' && file.endsWith('.ts'))
  .forEach(file => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    routers.push(require(path.join(routesPath, file)).default);
  });

export default routers;
