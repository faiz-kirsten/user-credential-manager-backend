import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.DB_URI);
        await mongoose.connect(process.env.DB_URI_NEW);
    } catch (err) {
        console.log(err);
    }
};
