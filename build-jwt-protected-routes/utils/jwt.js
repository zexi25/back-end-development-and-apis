import jwt from "jsonwebtoken";

function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'})
}

function verifyToken(token) {
    try{
    return jwt.verify(token, process.env.JWT_SECRET)
    } catch(err) {
        return null
    }
}
export {signToken, verifyToken}; 