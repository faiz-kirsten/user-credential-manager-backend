import { UserModel } from "../models/User.js";

// allow normal users to add credentials
// allow management & admin users to:
//  add credentials for themselves or for different users in their division
//  edit their own credentials, edit user credentials
// allow admin users to change user divisions and alter user roles
// create a dashboard that shows all the actions that were taken, i.e. who edited a users credentials, who changed whos division... which only admins can view and access
// when showing the credentials for the user - return the credentials where the division the current user is logged is the same and the userId is the same as the users Id that was clicked on

// verify with jwt
export const getUsers = async (req, res) => {
    const users = await UserModel.find({}).populate("division");

    return res.status(201).send({ users });
};

export const getUsernames = async (req, res) => {
    const users = await UserModel.find({}).populate("division");

    const usernames = users.map((user) => user.username);

    return res.status(201).send({ usernames });
};

export const getUser = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24)
        return res.status(400).send({ message: "Invalid user id" });

    const foundUser = await UserModel.findOne({
        _id: id,
    }).populate("division");
    if (!foundUser) return res.status(400).send({ message: "Invalid user id" });
    return res.status(200).send(foundUser);
};
