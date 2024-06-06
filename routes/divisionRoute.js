import express from "express";
import { getDivision } from "../controllers/divisionController.js";

const router = express.Router();

router.route("/:id").get(getDivision);

export default router;
