import stockStrategy from './stockStrategy';
import users from './users';
import Router from '@koa/router';
import Application from 'koa';

const routers: Router<Application.DefaultState, Application.DefaultContext>[] = [stockStrategy, users];
export default routers;
