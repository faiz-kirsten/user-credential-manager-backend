import express from "express";
import {
    getUser,
    getUserCredentials,
    getUserDivision,
    getUsernames,
    getUsers,
    updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/usernames", getUsernames);
router.get("/division", getUserDivision);
router.get("/:id/credentials", getUserCredentials);
router.get("/", getUsers);
router.route("/:id").get(getUser).put(updateUser);

export default router;
