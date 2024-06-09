import express from "express";
import { getDivisions } from "../controllers/divisionController.js";

const router = express.Router();

router.get("/", getDivisions);

export default router;
