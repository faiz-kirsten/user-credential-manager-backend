import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { PORT, mongoDBURL } from "./config.js";
// import models
import {
    UserModel,
    CredentialModel,
    CredentialRepoModel,
    DivisionModel,
    OrganisationalUnitModel,
} from "./models/models.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("This is the home page");
});

// login
app.post("/login", async (req, res) => {
    // login with username and password
    const usernameInput = req.body.username;
    const passwordInput = req.body.password;

    const user = await UserModel.findOne({
        username: usernameInput,
        password: passwordInput,
    });

    // generates a jwt for the valid user
    if (user) {
        let payload = user;
        const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
            algorithm: "HS256",
        });

        // set the token to local storage on the client side
        res.send({
            token: token,
            message: "Login was successful. Redirecting...",
        });
    } else {
        res.status(403).send({
            err: "Login Error! Invalid password or username!",
        });
    }
});

// Route to handle user registration, generating a unique username and adding user to the credential repository of their division
app.post("/register", async (req, res) => {
    // Extracting user input from the request body
    const divisionIdInput = req.body._divisionId;
    const nameInput = req.body.name;
    const surnameInput = req.body.surname;
    const passwordInput = req.body.password;

    let createdUsername;

    // Generate 3 random digits for creating a unique username
    var randomDigits = [];
    while (randomDigits.length < 3) {
        let randomDigit = Math.floor(Math.random() * 9) + 1;
        if (randomDigits.indexOf(randomDigit) === -1)
            randomDigits.push(randomDigit);
    }

    // Combine name and random digits to create the username
    createdUsername = `${nameInput}${randomDigits.join("")}`;

    // Create a new user object with the provided information
    const newUser = {
        name: nameInput,
        surname: surnameInput,
        username: createdUsername,
        password: passwordInput,
        _divisionId: new mongoose.Types.ObjectId(divisionIdInput),
        archived: false,
        role: "normal",
    };

    console.log(newUser);

    // Create the user in the database using the UserModel
    const user = await UserModel.create(newUser);

    // Respond with a success message and the created username
    return res.status(201).send({
        message: `User Registration Successful. Login with username: ${createdUsername}.`,
    });
});

// Route to fetch credential repository based on user's division ID and retrieve information about users in the division
app.get("/credential-repo", async (req, res) => {
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
});

// Get divisions
app.get("/divisions", async (req, res) => {
    const divisions = await DivisionModel.find({}).populate(
        "_organisationalUnitId"
    );
    // console.log(divisions);
    res.status(201).send({ divisions: divisions });
});

// Route to handle user registration, generating a unique username and adding user to the credential repository of their division
app.post("/credential", async (req, res) => {
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
});

// Route to update user credentials based on user ID

app.put("/credential/:id", async (req, res) => {
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
});

// Get users
app.get("/users", async (req, res) => {
    const users = await UserModel.find({}).populate("_divisionId");
    // console.log(divisions);
    res.status(201).send({ users: users });
});

// Route to change the role of a user, accessible to admin users

app.put("/user/role/update/:id", async (req, res) => {
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
});

// Route to assign or remove users from divisions, accessible to admin users

app.put("/user/division/update/:id", async (req, res) => {
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
            // const oldUserCredentials = await CredentialModel.find({
            //     _userId: id,
            //     _divisionId: userCurrentDivisionId,
            // });

            // res.send(oldUserCredentials);
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
});

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening on port: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
