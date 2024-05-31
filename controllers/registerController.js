import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";

export const handleRegister = async (req, res) => {
    const enteredName = req.body.name;
    const enteredSurname = req.body.surname;
    const enteredPassword = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;
    const enteredTitle = req.body.title;

    if (
        !enteredName ||
        !enteredSurname ||
        !enteredPassword ||
        !confirmedPassword ||
        !enteredTitle
    ) {
        return res.status(400).send({
            message: "All required fields not entered",
        });
    }

    // Create a new user object with the provided information
    const usernameExists = await UserModel.findOne({
        username: req.body.username,
    });

    if (usernameExists)
        return res.status(400).send({
            message: "Username already exists in database",
        });

    if (enteredPassword !== confirmedPassword)
        return res.status(400).send({
            message: "Password and confirmed password do not match",
        });

    try {
        const hashedPwd = await bcrypt.hash(enteredPassword, 10);

        const newUser = {
            name: enteredName,
            surname: req.body.surname,
            password: hashedPwd,
            username: req.body.username,
            title: req.body.title,
        };

        // Create the user in the database using the UserModel
        const userDB = await UserModel.create(newUser);

        // Respond with a success message and the created username
        return res.status(201).send({
            message: `${newUser.username} Registrated Successfully.`,
            user: userDB,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
