import express from "express";
import bcrypt from "bcryptjs";
import {randomUUID} from "crypto";
import {signToken} from "../utils/jwt.js";
import {findByEmail, readUsers, writeUsers} from "../utils/db.js"
import authenticate from "../middleware/authenticate.js";
import {blacklistToken} from "../utils/token-blacklist.js";


const router = express.Router();

router.get('/profile', authenticate, (req, res)=>{
    return res.json({user: req.user})
})

router.post('/register', async (req, res)=>{
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json("Email and password are required")
    }

    if (findByEmail(email)) {
        return res.status(409).json("Email already in use")
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = {
        id: randomUUID(),
        email: email,
        passwordHash: passwordHash,
        role: "user"
    }
    const users = readUsers();
users.push(user);
writeUsers(users);

    const token = signToken({id:user.id, email:user.email, role: user.role})
    return res.status(201).json({message: "successfully registered", token})
})

router.post('/login', async (req, res)=>{
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json("Email and password are required")
    }
    const user = findByEmail(email)
    if (!findByEmail(email)) {
        return res.status(401).json({error: "Invalid credentials"})
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        return res.status(401).json({error: "Invalid credentials"})
    } else {
        const token = signToken({id:user.id, email:user.email, role: user.role});
        return res.json({message: "welcome back", token})
    }
})

router.post('/logout', authenticate, (req, res)=>{
    const token = req.headers.authorization.split(" ")[1]
    blacklistToken(token)
    res.json("Logged out successfully")
})

export default router; 