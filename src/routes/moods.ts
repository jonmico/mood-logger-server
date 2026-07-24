import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { createMood, getMood, getMoods } from "../controllers/moods/index.js";

export const moodsRouter = Router();

moodsRouter.post("/create", authenticate, createMood);
moodsRouter.get("/", authenticate, getMoods);
moodsRouter.get("/:id", authenticate, getMood);
