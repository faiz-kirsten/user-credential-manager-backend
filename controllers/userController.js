import mongoose from "mongoose";
import { ROLES_LIST } from "../config/roles_list.js";
import { UserModel } from "../models/User.js";
import { CredentialModel } from "../models/Credential.js";
import { verifyJWT } from "../utils/verifyJWT.js";
import { verifyRoles } from "../utils/verifyRoles.js";
import { DivisionModel } from "../models/Division.js";

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

    const { id } = req.params;
    console.log(id);
    console.log(decoded._id);

    console.log(validRole);
    if (!validRole && id !== decoded._id)
        return res.status(403).send({
            message: "Unauthorized",
        });

    if (id.length !== 24)
        return res.status(400).send({ message: "Invalid user id" });

    const foundUser = await UserModel.findOne({
        _id: id,
    }).populate("division");
    if (!foundUser) return res.status(400).send({ message: "Invalid user id" });
    return res.status(200).send(foundUser);
};

export const getUserDivision = async (req, res) => {
    if (!req.headers["authorization"]?.startsWith("Bearer "))
        return res.sendStatus(401);
    // Extracting the JWT token from the request headers
    const token = req.headers["authorization"].split(" ")[1];
    if (token === "")
        return res.status(401).send({ message: "Invalid Auth Token!" });
    const decoded = verifyJWT(token);
    if (decoded === false)
        return res.status(401).send({ message: "Invalid Auth Token!" });
    // console.log(decoded);

    if (decoded.division === null || decoded.roles.length === 1)
        return res.status(200).send({ currentUser: decoded });
    // verify user roles
    const validRole = verifyRoles(decoded.roles, [
        ROLES_LIST[1],
        ROLES_LIST[2],
    ]);

    // console.log(validRole);
    if (!validRole)
        return res.status(403).send({
            message: "Unauthorized",
        });

    // const { id } = req.params;
    // if (id.length !== 24)
    //     return res.status(400).send({ message: "Invalid division id" });

    const foundDivision = await DivisionModel.findOne({
        _id: new mongoose.Types.ObjectId(decoded.division),
    })
        .populate("_userIds")
        .populate("_requestedUserIds");

    if (!foundDivision)
        return res.status(400).send({ message: "Invalid division id" });
    // console.log(foundDivision);
    const otherUsers = foundDivision._userIds.filter(
        (user) => user.username !== decoded.username
    );
    // console.log(filteredUsers);

    // requestedUsers
    const isAdmin = verifyRoles(decoded.roles, [ROLES_LIST[2]]);

    if (isAdmin) {
        const requestedUsers = await UserModel.find({
            requestedDivision: decoded.division,
        });
        return res.status(200).send({
            divisionDetails: foundDivision,
            currentUser: decoded,
            otherUsers: otherUsers,
            requestedUsers: requestedUsers,
        });
    }

    return res.status(200).send({
        divisionDetails: foundDivision,
        currentUser: decoded,
        otherUsers: otherUsers,
    });
};

export const getUserCredentials = async (req, res) => {
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
    const validRole = verifyRoles(decoded.roles, [
        ROLES_LIST[1],
        ROLES_LIST[2],
    ]);

    const { id } = req.params;
    const currentUserDivisionId = req.query.division;

    console.log(id);
    console.log(currentUserDivisionId);

    console.log(validRole);
    if (!validRole && id !== decoded._id)
        return res.status(403).send({
            message: "Unauthorized",
        });
    const foundUser = await UserModel.findOne({ _id: id }).populate("division");
    const foundCredentials = await CredentialModel.find({
        _userId: id,
        _divisionId: currentUserDivisionId,
    });

    return res.status(200).send({
        user: foundUser,
        credentials: foundCredentials,
        currentUser: decoded,
    });
};

export const updateUser = async (req, res) => {
    if (!req.headers["authorization"]?.startsWith("Bearer "))
        return res.sendStatus(401);
    // Extracting the JWT token from the request headers
    const token = req.headers["authorization"].split(" ")[1];
    if (token === "")
        return res.status(401).send({ message: "Invalid Auth Token!" });
    const decoded = verifyJWT(token);
    if (decoded === false)
        return res.status(401).send({ message: "Invalid Auth Token!" });
    // console.log(decoded);
    const requestBody = req.body;

    // verify user roles
    const validRole = verifyRoles(decoded.roles, [ROLES_LIST[2]]);

    const { id } = req.params;
    const isCurrentUser = req.query.currentUser;

    // console.log(validRole);
    if (!validRole && id !== decoded._id)
        return res.status(403).send({
            message: "Unauthorized",
        });

    if (isCurrentUser === "true") {
        if (
            requestBody.requestedDivision ||
            requestBody.division ||
            requestBody.roles
        )
            return res.status(403).send({
                message: "Unauthorized",
            });
    }

    console.log(requestBody);

    if (requestBody.accept) {
        const updatedProperties = {
            ...requestBody.properties,
            division: new mongoose.Types.ObjectId(
                requestBody.properties.division
            ),
        };
        console.log(updatedProperties);
        const updateUser = await UserModel.findOneAndUpdate(
            { _id: requestBody.userId },
            updatedProperties,
            {
                new: true,
            }
        );
        const division = await DivisionModel.findOne({
            _id: decoded.division,
        });
        division._requestedUserIds.pull(
            new mongoose.Types.ObjectId(requestBody.userId)
        );
        division._userIds.push(new mongoose.Types.ObjectId(requestBody.userId));
        await division.save();
        console.log(division);
    }
    // if (requestBody.properties.requestedDivision === null) {
    //     console.log(requestBody.properties.requestedDivision);
    // }
    // const updateUser = await UserModel.findOneAndUpdate(
    //     { _id: requestBody.userId },
    //     requestBody.properties,
    //     {
    //         new: true,
    //     }
    // );

    // if (selectingDivision === "true") {
    //     const division = await DivisionModel.findOne({
    //         _id: requestBody.selectedDivision,
    //     });
    //     division._requestedUserIds.push(new mongoose.Types.ObjectId(id));
    //     await division.save();
    //     const updatedUserDivision = await UserModel.findOneAndUpdate(
    //         { _id: id },
    //         { requestedDivision: requestBody.selectedDivision },
    //         {
    //             new: true,
    //         }
    //     ).populate("requestedDivision");

    //     return res.send({
    //         success: `You have sent a request to join the ${division.name} division.`,
    //         currentUser: updatedUserDivision,
    //     });
    // }

    return res.send({
        reqBody: requestBody,
        currentUser: decoded,
        isCurrentUser,
    });
};
