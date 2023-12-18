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
        console.log(payload);
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
    const divisionIdInput = req.body.divisionId;
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

    // Create the user in the database using the UserModel
    // const user = await UserModel.create(newUser);

    // Retrieve the new user's division ID and user ID
    // const newUserDivisionId = user._divisionId;
    // const newUserId = user._id;

    // Find the credential repository for the user's division
    // const divisionCredRepo = await CredentialRepoModel.findOne({
    //     _divisionId: newUserDivisionId,
    // });

    // Add the user's ID to the array within 'divisionCredRepo' as another iteration
    // divisionCredRepo._credentialIds.push(newUserId);

    // Save the updated credential repository
    // await divisionCredRepo.save();

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
            const credential = await CredentialModel.findById(credentialId);
            if (credential) {
                credentials.push(credential);
            }
        }

        let credentialsCount = credentials.length;

        // Respond with division information and user details if users are present
        if (credentials.length > 0) {
            res.send({
                divisionName: divisionName,
                divisionOuName: divisionOuName,
                divisionId: decoded._divisionId,
                credentialsCount: credentialsCount,
                currentUser: decoded,
                credentials: credentials,
            });
        } else {
            // Respond with a message if no users are found in the division
            res.send({ message: "No credentials in the division!" });
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
