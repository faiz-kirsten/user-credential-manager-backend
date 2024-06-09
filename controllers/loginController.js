// user bcrypt and username to identify if it is a legit user and return an access token
import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleLogin = async (req, res) => {
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;

    if (!enteredUsername || !enteredPassword) {
        return res.status(400).send({
            message: "Username and password are required.",
        });
    }

    const foundUser = await UserModel.findOne({
        username: enteredUsername,
    }).populate("requestedDivision");

    if (!foundUser) return res.status(403).send({ invalid: true }); //Unauthorized

    const validPassword = await bcrypt.compare(
        enteredPassword,
        foundUser.password
    );
    // generates a jwt for the valid user
    if (validPassword) {
        let payload = foundUser;
        const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
            algorithm: "HS256",
        });

        // set the token to local storage on the client side
        res.status(200).send({
            token: token,
        });
    } else {
        res.status(403).send({
            message: "Invalid password username or password!",
        });
    }
};
