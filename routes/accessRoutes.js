import express from "express";
// import controllers
import {
    userLogin,
    userRegistration,
} from "../controllers/accessControllers.js";

const router = express.Router();

// user login
router.post("/login", userLogin);

// Route to handle user registration, generating a unique username and adding user to the credential repository of their division
router.post("/register", userRegistration);

export default router;
