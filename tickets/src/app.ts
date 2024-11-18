import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { Errorhandle, NotFoundError } from "@ticketwithspread/common";
import ticketsRouter from "./routes/new";
import showticket from "./routes/show";
import updateTicket from "./routes/update";
import indexTickets from "./routes/index";
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
app.use(indexTickets);
app.use(ticketsRouter);
app.use(showticket);
app.use(updateTicket);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(Errorhandle);

export { app };
