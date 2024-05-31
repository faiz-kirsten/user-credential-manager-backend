import mongoose from "mongoose";
import Division from "./Division";
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
            type: Division,
            default: null,
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

export default mongoose.model("User", userSchema);
