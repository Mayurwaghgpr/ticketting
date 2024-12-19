import express, { Request, Response } from "express";

import { Ticket } from "../model/ticket";
import {
  currentUser,
  NotFoundError,
  requireAuth,
} from "@ticketwithspread/common";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);
export default router;
