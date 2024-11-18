import "express-async-errors";
import mongoose from "mongoose";
import express from "express";
import { json } from "body-parser";
import currentuser from "./routers/current-user";
import signin from "./routers/signin";
import signup from "./routers/signup";
import signout from "./routers/signout";
import cookieSession from "cookie-session";
import "express-async-errors";
import { Errorhandle } from "@ticketwithspread/common";

const app = express();
app.set("trust proxy", true);
app.use(json());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.JWT_KEY!],
  })
);

app.use(currentuser);
app.use(signin);
app.use(signup);
app.use(signout);
app.use(Errorhandle);

const start = async () => {
  console.log("starting up...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }

  app.listen(3000, () => {
    console.log("Running on port 3000!");
  });
};

start();
