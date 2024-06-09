import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        division: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Division",
            default: null,
        },
        requestedDivision: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Division",
        },
        roles: {
            type: [String],
            default: ["user"],
            enum: ["user", "management", "admin"],
        },
        password: {
            type: String,
            required: true,
        },
    },
    { collection: "Users" }
);

export const UserModel = mongoose.model("User", userSchema);
