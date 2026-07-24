import { Router } from "express";
import authenticate from "../middleware/authenticate.js";

export const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/me", authenticate, me);
