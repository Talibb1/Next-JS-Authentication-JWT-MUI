import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const DB_NAME = process.env.DB_NAME;
export const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
export const PORT = process.env.PORT;
export const FRONTEND_HOST_DEVELOPMENT = process.env.FRONTEND_HOST_DEVELOPMENT;
export const FRONTEND_HOST_PRODUCTION = process.env.FRONTEND_HOST_PRODUCTION;
export const SALT = process.env.SALT;
export const PEPPER = process.env.PEPPER;
export const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;
export const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const EMAIL_FROM = process.env.EMAIL_FROM;
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
