import mongoose from "mongoose";
const Schema = mongoose.Schema;

const credentialSchema = new Schema(
    {
        platform: { type: String, required: true },
        password: { type: String, required: true },
        _divisionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Division",
        },
        _userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { collection: "Credentials" }
);

export const CredentialModel = mongoose.model("Credential", credentialSchema);
