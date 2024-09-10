import { configDotenv } from 'dotenv';

configDotenv();

export const LICENSE = { MAIRUI: 'aa43656c35008536b3' };
console.log(process.env.BASE_URL);

export const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1') + ':80';
