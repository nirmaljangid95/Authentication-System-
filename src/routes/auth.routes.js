import { Router } from "express";
import {register, getMe} from "../controllers/auth.controller.js"
const authroute = Router();


authroute.post("/register",register);
authroute.get("/get-me",getMe);

export default authroute
