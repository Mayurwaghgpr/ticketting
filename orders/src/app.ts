import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { Errorhandle, NotFoundError } from "@ticketwithspread/common";
import indexOrderRoter from "./routes/index";
import newOrderRoter from "./routes/new";
import showOrderRoter from "./routes/show";
import deleteOrderRoter from "./routes/delete";
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

app.use(indexOrderRoter);
app.use(newOrderRoter);
app.use(showOrderRoter);
app.use(deleteOrderRoter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(Errorhandle);

export { app };
