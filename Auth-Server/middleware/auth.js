import { verify } from "jsonwebtoken";
import { TOKEN_KEY } from '../config/config.js'


export default function verifyToken (req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(403).send("access denied");
  }

  verify(token, TOKEN_KEY, (err, user) => 
  {
    if (err) {
      return res.sendStatus(401);
    }

    req.user = user;
    next();
  })
  
};


