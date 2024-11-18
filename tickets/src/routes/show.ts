import express, { Request, Response } from "express";

import { Ticket } from "../model/ticket";
import {
  currentUser,
  NotFoundError,
  requireAuth,
} from "@ticketwithspread/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  console.log(req.params.id);
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.status(200).json(ticket);
});
export default router;
