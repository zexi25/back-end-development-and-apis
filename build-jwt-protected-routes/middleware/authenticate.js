import {isBlacklisted} from "../utils/token-blacklist.js"
import {verifyToken} from "../utils/jwt.js";

export default function authenticate(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.status(401).json("No token provided")
    } 
        const token = req.headers.authorization.split(" ")[1]
        if (isBlacklisted(token)) {
            return res.status(401).json("Token has been invalidated. Log in again.")
        }
    
    const decoded = verifyToken(token);
    if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = decoded;

    next()
}

