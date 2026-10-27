import {isBlacklisted} from "../utils/token-blacklist.js"

export default function authenticate(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.status(401).json("No token provided")
    } else {
        const token = req.headers.authorization.split(" ")[1]
        if (isBlacklisted(token)) {
            return res.status(401).json("Token has been invalidated. Log in again.")
        }
    }
    next()
}

