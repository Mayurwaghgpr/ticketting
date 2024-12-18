import "express-async-errors";
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
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    keys: [process.env.JWT_KEY!],
  })
);

app.use(currentuser);
app.use(signin);
app.use(signup);
app.use(signout);
app.use(Errorhandle);

export { app };
