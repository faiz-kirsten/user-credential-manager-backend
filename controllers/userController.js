import { ROLES_LIST } from "../config/roles_list.js";
import { UserModel } from "../models/User.js";
import { verifyJWT } from "../utils/verifyJWT.js";
import { verifyRoles } from "../utils/verifyRoles.js";

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

// add one change this to edit user
// when checking if a user is allowed to edit user details -> check if the :id parameter is equal to the decoded._id value or if the user is an admin
export const getUser = async (req, res) => {
    if (!req.headers["authorization"]?.startsWith("Bearer "))
        return res.sendStatus(401);
    // Extracting the JWT token from the request headers
    const token = req.headers["authorization"].split(" ")[1];
    if (token === "")
        return res.status(401).send({ message: "Invalid Auth Token!" });
    const decoded = verifyJWT(token);
    if (decoded === false)
        return res.status(401).send({ message: "Invalid Auth Token!" });
    console.log(decoded);
    // verify user roles
    const validRole = verifyRoles(decoded.roles, [ROLES_LIST[2]]);

    console.log(validRole);
    if (!validRole)
        return res.status(403).send({
            message: "Unauthorized",
        });

    const { id } = req.params;
    if (id.length !== 24)
        return res.status(400).send({ message: "Invalid user id" });

    const foundUser = await UserModel.findOne({
        _id: id,
    }).populate("division");
    if (!foundUser) return res.status(400).send({ message: "Invalid user id" });
    return res.status(200).send(foundUser);
};
