import express from "express";
import bcrypt from "bcrypjs";
import randomUUID from "crypto";
import {signToken} from "../utils/jwt.js";
import {findByEmail, readUsers, writeUsers} from "../utils.db.js"
const router = express.Router();

router.post('/register', async (req, res)=>{
    const {email, password} = req.body

    if (!email || !password) {
        res.status(400).json("Email and password are required")
    }

    if (findByEmail(email)) {
        res.status(409).json("Email already in use")
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = {
        id: randomUUID(),
        email: email,
        passwordHash: passwordHash,
        role: "user"
    }
    writeUsers(readUsers().push(user))

    const token = signToken({id:user.id, email:user.email, role})
    res.status(201).json("successfully registered", token)
})

router.post('/login', async (req, res)=>{
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400).json("Email and password are required")
    }

    if (!findByEmail(email)) {
        res.status(401).json("Invalid credentials")
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        res.status(401)
    } else {
        const token = signToken({id:user.id, email:user.email, role});
        res.json("welcome back", token)
    }
})
export default router; 