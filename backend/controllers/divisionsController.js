import {
    UserModel,
    CredentialModel,
    CredentialRepoModel,
    DivisionModel,
    OrganisationalUnitModel,
} from "../models/models.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const getCredentialRepo = async (req, res) => {
    // Extracting the JWT token from the request headers
    const token = req.headers["authorization"].split(" ")[1];

    try {
        // Verify and decode the JWT token using the provided secret
        const decoded = jwt.verify(token, "jwt-secret");

        // Find the credential repository based on the user's division ID
        const credentialRepo = await CredentialRepoModel.findOne({
            _divisionId: decoded._divisionId,
        });

        // Retrieve user division and organizational unit name
        const userDivision = await DivisionModel.findOne({
            _id: decoded._divisionId,
        }).populate("_organisationalUnitId");

        let divisionName = userDivision.name;
        let divisionOuName = userDivision._organisationalUnitId.name;

        let credentials = [];

        // Iterate through all the user IDs in the credential repository
        for (const credentialId of credentialRepo._credentialIds) {
            // Find and add user information to the 'users' array
            const credential = await CredentialModel.findById(
                credentialId
            ).populate("_userId");
            if (credential.archived !== true) {
                credentials.push(credential);
            }
        }

        let credentialsCount = credentials.length;

        // Respond with division information and user details if users are present

        res.status(201).send({
            divisionName: divisionName,
            divisionOuName: divisionOuName,
            divisionId: decoded._divisionId,
            credentialsCount: credentialsCount,
            currentUser: decoded,
            credentials: credentials,
        });
    } catch (err) {
        // Handle unauthorized access with a 401 status and appropriate message
        res.status(401).send({ message: "Invalid Auth Token!" });
    }
};

export const getDivisions = async (req, res) => {
    const divisions = await DivisionModel.find({}).populate(
        "_organisationalUnitId"
    );
    // console.log(divisions);
    res.status(201).send({ divisions: divisions });
};

export const addCredential = async (req, res) => {
    // Extracting user input from the request body
    const divisionIdInput = req.body._divisionId;
    const platformInput = req.body.platform;
    const passwordInput = req.body.password;
    const userIdInput = req.body._userId;

    // Create a new user object with the provided information
    const newCredential = {
        platform: platformInput,
        _divisionId: new mongoose.Types.ObjectId(divisionIdInput),
        _userId: new mongoose.Types.ObjectId(userIdInput),
        password: passwordInput,
        archived: false,
    };

    // Create the user in the database using the UserModel
    const credential = await CredentialModel.create(newCredential);

    // Retrieve the new user's division ID and user ID
    const newCredentialDivisionId = credential._divisionId;
    const newCredentialId = credential._id;

    // Find the credential repository for the user's division
    const divisionCredRepo = await CredentialRepoModel.findOne({
        _divisionId: newCredentialDivisionId,
    });

    // Add the user's ID to the array within 'divisionCredRepo' as another iteration
    divisionCredRepo._credentialIds.push(newCredentialId);

    // Save the updated credential repository
    await divisionCredRepo.save();

    // Respond with a success message and the created username
    return res.status(201).send({
        message: `Credential Added Successful. `,
    });
};

export const updateCredential = async (req, res) => {
    // Extracting the JWT token from the request headers
    const token = req.headers["authorization"].split(" ")[1];

    try {
        // Verify and decode the JWT token using the provided secret
        const decoded = jwt.verify(token, "jwt-secret");

        // Check if the decoded user has the "normal" role; deny access if true
        if (decoded.role === "normal") {
            return res.status(403).send({
                message: "Unauthorized",
            });
        } else {
            // Extract the user ID from the request parameters
            const { id } = req.params;

            // Update the user by finding its ID and applying the request body
            const result = await CredentialModel.findByIdAndUpdate(
                id,
                req.body
            );

            // Respond with a 404 status and message if the user is not found
            if (!result) {
                return res
                    .status(404)
                    .json({ message: "Credential not found" });
            }

            // Respond with a success message if the user is updated successfully
            return res
                .status(200)
                .send({ message: "Credential updated successfully" });

            // Note: If the name or surname are edited, a new username should be generated
        }
    } catch (err) {
        // Handle unauthorized access with a 401 status and appropriate message
        res.status(401).send({ message: "Invalid Auth Token!" });
    }
};
