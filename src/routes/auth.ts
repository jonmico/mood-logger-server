import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { login, logout, me, register } from "../controllers/auth/index.js";

export const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/me", authenticate, me);
