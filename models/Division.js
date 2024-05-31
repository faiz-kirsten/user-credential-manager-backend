import mongoose from "mongoose";
const Schema = mongoose.Schema;
import User from "./User";

const divisionSchema = new Schema(
    {
        name: { type: String, required: true },
        _userIds: [{ type: mongoose.Schema.Types.ObjectId, User }],
    },
    { collection: "Divisions" }
);

export default mongoose.model("Division", divisionSchema);
