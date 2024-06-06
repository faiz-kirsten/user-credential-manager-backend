import express from "express";
import {
    getUser,
    getUsernames,
    getUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/usernames", getUsernames);
router.get("/", getUsers);
router.route("/:id").get(getUser);

export default router;
