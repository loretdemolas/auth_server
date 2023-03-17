import { verify } from "jsonwebtoken";
import { TOKEN_KEY } from '../config/config.js'

function verifyToken (req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(403).send("access denied");
  }
  try {
    const verified = verify(token, TOKEN_KEY);
    req.user = verified;
  } catch (err) {
      return res.status(401).send("Invalid Token");
  }
  return next();
};

export {verifyToken as default}