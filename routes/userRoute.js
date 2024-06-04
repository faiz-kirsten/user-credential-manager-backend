import express from "express";
import {
    getUser,
    getUsernames,
    getUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/usernames", getUsernames);

router.route("/:id").get(getUser);

export default router;
