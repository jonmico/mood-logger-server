import { Router } from "express";
import register from "../controllers/user/register.js";
import login from "../controllers/user/login.js";

export const userRouter = Router();

userRouter.post("/register", register);
userRouter.get("/login", login);
