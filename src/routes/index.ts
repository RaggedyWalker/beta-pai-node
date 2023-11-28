import Router from '@koa/router';
import { DefaultContext, DefaultState } from 'koa';
import path from 'path';
import * as fs from 'fs';

const routers: Router<DefaultState, DefaultContext>[] = [];

// 获取routes目录
const routesPath = path.join(__dirname);
fs.readdirSync(routesPath)
  .filter(file => file !== 'index.ts' && file.endsWith('.ts'))
  .forEach(file => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    routers.push(require(path.join(routesPath, file)).default);
  });

export default routers;
