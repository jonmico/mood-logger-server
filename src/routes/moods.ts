import { Router } from "express";
import { createMood } from "../controllers/moods/createMood.js";

export const moodsRouter = Router();

moodsRouter.post("/create", createMood);
