import { Router } from "express";
import { register } from "../controllers/auth/register.js";
import { login } from "../controllers/auth/login.js";
import { me } from "../controllers/auth/me.js";
import authenticate from "../middleware/authenticate.js";

export const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/me", authenticate, me);
