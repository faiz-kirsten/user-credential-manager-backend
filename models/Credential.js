import mongoose from "mongoose";
const Schema = mongoose.Schema;
import User from "./User";
import Division from "./Division";

const credentialSchema = new Schema(
    {
        platform: { type: String, required: true },
        password: { type: String, required: true },
        _divisionId: { type: mongoose.Schema.Types.ObjectId, ref: Division },
        _userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
    },
    { collection: "Credentials" }
);

export default mongoose.model("Credential", credentialSchema);
