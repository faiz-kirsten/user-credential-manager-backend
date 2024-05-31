import { DivisionModel } from "../models/Division.js"; // admins can add new divisions
// remove user from a division
// transfer user to another division
// if the user is transferred to a new division, archive the credentials linked to that division
// return the users of the division of the current user that is logged in if they are admins
export const getDivision = async (req, res) => {
    const { id } = req.params;
    if (id.length !== 24)
        return res.status(400).send({ message: "Invalid division id" });

    const foundDivision = await DivisionModel.findOne({
        _id: id,
    }).populate("_userIds");
    if (!foundDivision)
        return res.status(400).send({ message: "Invalid division id" });

    return res.status(200).send(foundDivision);
};
