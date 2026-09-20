import { Router } from "express";
import {register, getMe,refreshToken} from "../controllers/auth.controller.js"
const authroute = Router();


authroute.post("/register",register);
authroute.get("/get-me",getMe);
authroute.get("/refresh-token",refreshToken);


export default authroute
