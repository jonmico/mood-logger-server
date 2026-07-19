import { Router } from "express";
import { createMood } from "../controllers/moods/createMood.js";
import authenticate from "../middleware/authenticate.js";

export const moodsRouter = Router();

moodsRouter.post("/create", authenticate, createMood);
