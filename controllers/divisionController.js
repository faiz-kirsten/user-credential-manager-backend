import { DivisionModel } from "../models/Division.js";
import { verifyRoles } from "../utils/verifyRoles.js";
import { verifyJWT } from "../utils/verifyJWT.js";
import { ROLES_LIST } from "../config/roles_list.js";

// admins can add new divisions
// remove user from a division
// transfer user to another division
// if the user is transferred to a new division, archive the credentials linked to that division
// return the users of the division of the current user that is logged in if they are admins
export const getDivision = async (req, res) => {
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

    const { id } = req.params;
    if (id.length !== 24)
        return res.status(400).send({ message: "Invalid division id" });

    const foundDivision = await DivisionModel.findOne({
        _id: id,
    });

    if (!foundDivision)
        return res.status(400).send({ message: "Invalid division id" });
    // console.log(foundDivision);
    const filteredUsers = foundDivision._userIds.filter(
        (user) => user.username !== decoded.username
    );
    // console.log(filteredUsers);

    return res.status(200).send({
        divisionDetails: foundDivision,
        currentUser: decoded,
        otherUsers: filteredUsers,
    });
};
