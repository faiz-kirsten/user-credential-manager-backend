import { DivisionModel } from "../models/Division.js";
import { verifyRoles } from "../utils/verifyRoles.js";
import { verifyJWT } from "../utils/verifyJWT.js";
import { ROLES_LIST } from "../config/roles_list.js";

// admins can add new divisions
// remove user from a division
// transfer user to another division
// if the user is transferred to a new division, archive the credentials linked to that division
// return the users of the division of the current user that is logged in if they are admins
export const getDivisions = async (req, res) => {
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

    const divisions = await DivisionModel.find({}, "_id name");

    return res.status(200).send({
        allDivisions: divisions,
        currentUser: decoded,
    });
};
