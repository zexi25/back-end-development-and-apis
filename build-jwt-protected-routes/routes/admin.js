import express from "express";
import authenticate from "../middleware/authenticate.js";
import authorizeRole from "../middleware/authorize.js";
import {readUsers } from "../utils/db.js";

const router = express.Router();

router.get('/users', authenticate, authorizeRole('admin'), (req, res)=>{
    return res.json(readUsers().map(({passwordHash, ...rest})=>rest))
})

export default router;