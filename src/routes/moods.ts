import { Router } from "express";
import { createMood } from "../controllers/moods/createMood.js";
import authenticate from "../middleware/authenticate.js";
import { getMoods } from "../controllers/moods/getMoods.js";

export const moodsRouter = Router();

moodsRouter.post("/create", authenticate, createMood);
moodsRouter.get("/", authenticate, getMoods);
