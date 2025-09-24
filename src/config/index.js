import dotenv from 'dotenv';
dotenv.config();

export const FRONTEND_URL = process.env.FRONTEND_URL;
export const FROM_EMAIL = process.env.FROM_EMAIL;
export const ADMIN_EMAILS = process.env.ADMIN_EMAILS.split(',');
export const OWNER_EMAIL = process.env.OWNER_EMAIL;
export const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL;
export const JWT_SECRET = process.env.JWT_SECRET;
