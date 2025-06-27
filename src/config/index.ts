import { configDotenv } from 'dotenv';

configDotenv();

export const LICENSE = { MAIRUI: 'aa43656c35008536b3' };

export const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1';

export const JWT_SECRET = 'betajwt';

export const MAIL_U = process.env.MAIL_U;
export const MAIL_P = process.env.MAIL_P;
export const MAIL_HOST = process.env.MAIL_HOST;
export const ME_MAIL = 'zhuyonglin42@126.com';
export const INVITE_KEY = process.env.INVITE_KEY;
