import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";

export const handleRegister = async (req, res) => {
    const enteredName = req.body.name;
    const enteredSurname = req.body.surname;
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;
    const enteredTitle = req.body.title;

    if (
        !enteredName ||
        !enteredSurname ||
        !enteredUsername ||
        !enteredPassword ||
        !confirmedPassword ||
        !enteredTitle
    ) {
        return res.status(400).send({
            message: "All required fields not entered",
            ok: false,
        });
    }

    // Create a new user object with the provided information
    const usernameExists = await UserModel.findOne({
        username: enteredUsername,
    });

    if (usernameExists)
        return res.status(400).send({
            message: "Username already exists in database",
            ok: false,
        });

    if (enteredPassword !== confirmedPassword)
        return res.status(400).send({
            message: "Password and confirmed password do not match",
            ok: false,
        });

    try {
        const hashedPwd = await bcrypt.hash(enteredPassword, 10);

        const newUser = {
            name: enteredName,
            surname: enteredSurname,
            password: hashedPwd,
            username: enteredUsername,
            title: enteredTitle,
        };

        // Create the user in the database using the UserModel
        const userDB = await UserModel.create(newUser);

        // Respond with a success message and the created username
        return res.status(201).send({
            message: `Registration successful, redirecting to login page...`,
            username: enteredUsername,
            ok: true,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
