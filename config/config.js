// config.js
import * as dotenv from 'dotenv';
dotenv.config({
    
}) 
export const PORT = process.env.PORT;
export const CLIENT = process.env.CLIENT;
export const MONGO_URI = process.env.MONGO_URI;
export const TOKEN_KEY = process.env.TOKEN_KEY;
export const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;