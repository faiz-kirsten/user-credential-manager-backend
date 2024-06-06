import express from "express";
// import controllers
import {
    getUsers,
    updateUserRole,
    updateUserDivision,
} from "../../controllers/old/usersController.js";

const router = express.Router();

// Get users
router.get("/", getUsers);

// Route to change the role of a user, accessible to admin users
router.put("/user/:id/role/update", updateUserRole);

// Route to assign or remove users from divisions, accessible to admin users
router.put("/user/:id/division/update", updateUserDivision);

export default router;
