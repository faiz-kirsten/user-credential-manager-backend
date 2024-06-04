import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { connectDB } from "./config/dbCon.js";
import { corsOptions } from "./config/corsOptions.js";
import { credentials } from "./middleware/credentials.js";
const PORT = 5555;

// import routes
// import usersRoutes from "./routes/usersRoutes.js";
// import divisionsRoutes from "./routes/divisionsRoutes.js";
// import accessRoutes from "./routes/accessRoutes.js";
import registerRoute from "./routes/registerRoute.js";
import userRoute from "./routes/userRoute.js";
import divisionRoute from "./routes/division.js";
import loginRoute from "./routes/loginRoute.js";

const app = express();
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
// app.use(cors(corsOptions));
app.use(cors());

app.use(bodyParser.json());

// app.use("/users", usersRoutes); // use the usersRoutes
// app.use("/access", accessRoutes); // use the accessRoutes
// app.use("/divisions", divisionsRoutes); // use the divisionsRoutes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/users", userRoute);
app.use("/division", divisionRoute);

app.get("/", (req, res) => {
    res.send("API up and running...");
});

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
        console.log(`Server running on port http://localhost:${PORT}`)
    );
});
