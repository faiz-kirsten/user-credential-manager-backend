import { UserModel } from "../../models/models.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const userLogin = async (req, res) => {
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
};

export const userRegistration = async (req, res) => {
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

    // Create the user in the database using the UserModel
    const user = await UserModel.create(newUser);

    // Respond with a success message and the created username
    return res.status(201).send({
        message: `User Registration Successful. Login with username: ${createdUsername}.`,
    });
};
