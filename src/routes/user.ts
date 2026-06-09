import { Router } from "express";
import register from "../controllers/user/register.js";

export const userRouter = Router();

userRouter.post("/register", register);
