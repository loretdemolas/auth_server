import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../config/config.js';
import pkg from "jsonwebtoken";
const { sign } = pkg;

export function generateAccessToken(user) {
    return sign({_id: user._id}, TOKEN_KEY, { expiresIn: "5s" });
}

export function generateRefreshToken(user) {
    return sign({_id: user._id}, REFRESH_TOKEN_KEY);
}