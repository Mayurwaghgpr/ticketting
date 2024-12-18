import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { Errorhandle, NotFoundError } from "@ticketwithspread/common";
import { createdChargeRouter } from "./routes/new";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    keys: [process.env.JWT_KEY!],
  })
);
app.use(createdChargeRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(Errorhandle);

export { app };
