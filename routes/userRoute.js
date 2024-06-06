import express from "express";
import {
    getUser,
    getUserDivision,
    getUsernames,
    getUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/usernames", getUsernames);
router.get("/division", getUserDivision);
router.get("/", getUsers);
router.route("/:id").get(getUser);

export default router;
