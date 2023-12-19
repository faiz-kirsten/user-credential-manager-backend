import { UserModel, CredentialModel } from "../models/models.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    const users = await UserModel.find({}).populate("_divisionId");
    // console.log(divisions);
    res.status(201).send({ users: users });
};

export const updateUserRole = async (req, res) => {
    // Extracting the JWT token from the request headers
    const token = req.headers["authorization"].split(" ")[1];

    try {
        // Verify and decode the JWT token using the provided secret
        const decoded = jwt.verify(token, "jwt-secret");

        // Check if the decoded user has the "admin" role; deny access if not
        if (decoded.role !== "admin") {
            return res.status(403).send({
                message: "Unauthorized",
            });
        } else {
            // Extract the user ID from the request parameters
            const { id } = req.params;

            // Update the user by finding its ID and applying the request body
            const result = await UserModel.findByIdAndUpdate(id, req.body);

            // Respond with a 404 status and message if the user is not found
            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }

            // Respond with a success message if the user is updated successfully
            return res
                .status(200)
                .send({ message: "User role updated successfully" });

            // Note: If the name or surname are edited, a new username should be generated
        }
    } catch (err) {
        // Handle unauthorized access with a 401 status and appropriate message
        res.status(401).send({ message: "Invalid Auth Token!" });
    }
};

export const updateUserDivision = async (req, res) => {
    // Extracting the JWT token from the request headers
    const token = req.headers["authorization"].split(" ")[1];

    try {
        // Verify and decode the JWT token using the provided secret
        const decoded = jwt.verify(token, "jwt-secret");

        // Check if the decoded user has the "admin" role; deny access if not
        if (decoded.role !== "admin") {
            return res.status(403).send({
                message: "Unauthorized",
            });
        } else {
            // Extract the user ID from the request parameters
            const { id } = req.params;

            // Prepare the new division information from the request body
            const newDivisionId = req.body._divisionId;

            // Find the user's current division
            const user = await UserModel.findById(id);
            let userCurrentDivisionId = user._divisionId;
            // res.send(userCurrentDivisionId);

            const oldDivisionCredentials = await CredentialModel.updateMany(
                {
                    _userId: new mongoose.Types.ObjectId(id),
                    _divisionId: new mongoose.Types.ObjectId(
                        userCurrentDivisionId
                    ),
                },
                { archived: true }
            );

            // Update the user's division ID with the new division information
            const result = await UserModel.findByIdAndUpdate(id, req.body);

            const newDivisionCredentials = await CredentialModel.updateMany(
                {
                    _userId: new mongoose.Types.ObjectId(id),
                    _divisionId: new mongoose.Types.ObjectId(newDivisionId),
                },
                { archived: false }
            );

            // Respond with a success message upon successful user division change
            res.send({ message: "User division successfully changed." });
        }
    } catch (err) {
        // Handle unauthorized access with a 401 status and appropriate message
        res.status(401).send({ message: "Invalid Auth Token!" });
    }
};
