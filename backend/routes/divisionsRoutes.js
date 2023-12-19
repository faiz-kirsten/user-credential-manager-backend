import express from "express";
// import controllers
import {
    getCredentialRepo,
    getDivisions,
    addCredential,
    updateCredential,
} from "../controllers/divisionsController.js";

const router = express.Router();

// Get divisions
router.get("/", getDivisions);

// Route to fetch credential repository based on user's division ID and retrieve information about users in the division
router.get("/division/credential-repo", getCredentialRepo);

// Route to handle adding a new credential
router.post("/division/credential-repo/credential/add", addCredential);

// Route to update user credentials based on user ID
router.put("/division/credential-repo/credential/:id/update", updateCredential);

export default router;
