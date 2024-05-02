import mongoose from "mongoose";

// user model
const User = new mongoose.Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        password: { type: String, required: true },
        username: { type: String, required: true },
        role: {
            type: String,
            required: true,
            enum: ["normal", "management", "admin"],
        },
        _divisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
    },
    { collection: "credentials-app_user" }
);

export const UserModel = mongoose.model("User", User);

// organisational unit
const OrganisationalUnit = new mongoose.Schema(
    {
        name: { type: String, required: true },
        _divisionIds: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
        ],
    },
    { collection: "credentials-app_ou" }
);

export const OrganisationalUnitModel = mongoose.model(
    "OrganisationalUnit",
    OrganisationalUnit
);

// division model
const Division = new mongoose.Schema(
    {
        name: { type: String, required: true },
        _credentialRepoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CredentialRepo",
        },
        _organisationalUnitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrganisationalUnit",
        },
    },
    { collection: "credentials-app_division" }
);

export const DivisionModel = mongoose.model("Division", Division);

// credential repo
const CredentialRepo = new mongoose.Schema(
    {
        _divisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
        _credentialIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { collection: "credentials-app_credentialRepo" }
);

export const CredentialRepoModel = mongoose.model(
    "CredentialRepo",
    CredentialRepo
);

// credential
const Credential = new mongoose.Schema(
    {
        platform: { type: String, required: true },
        password: { type: String, required: true },
        _divisionId: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
        _userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        archived: { type: Boolean, required: true },
    },
    { collection: "credentials-app_credential" }
);

export const CredentialModel = mongoose.model("Credential", Credential);
