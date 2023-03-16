import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Routes from "./routes/Routes.js";

dotenv.config();
export const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
const URL = "mongodb+srv://ayush-admin:bXG6osULSvpDQyVP@cluster0.64kksbi.mongodb.net/?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
try {
    await mongoose.connect(URL,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    console.log("Database Connected Succesfully");
} catch (error) {
    console.log("Error: ", error.message);
}

app.use("/",Routes);

app.listen(3000, function () {
    console.log("Server started on port 3000");
})
