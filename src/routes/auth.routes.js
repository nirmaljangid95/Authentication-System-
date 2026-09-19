import { Router } from "express";
import register from "../controllers/auth.controller.js"
const authroute = Router();


authroute.post("/register",register)

export default authroute
