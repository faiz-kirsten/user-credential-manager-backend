import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { PORT, mongoDBURL } from "./config.js";

// import routes
import usersRoutes from "./routes/usersRoutes.js";
import divisionsRoutes from "./routes/divisionsRoutes.js";
import accessRoutes from "./routes/accessRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/users", usersRoutes); // use the usersRoutes
app.use("/access", accessRoutes); // use the accessRoutes
app.use("/divisions", divisionsRoutes); // use the divisionsRoutes

app.get("/", (req, res) => {
    res.send("This is the home page");
});

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening on port: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
