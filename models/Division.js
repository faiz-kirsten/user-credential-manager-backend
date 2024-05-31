import mongoose from "mongoose";
const Schema = mongoose.Schema;

const divisionSchema = new Schema(
    {
        name: { type: String, required: true },
        _userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        _requestedUserIds: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ],
    },
    { collection: "Divisions" }
);

export const DivisionModel = mongoose.model("Division", divisionSchema);
