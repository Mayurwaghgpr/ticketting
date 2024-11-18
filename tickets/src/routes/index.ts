import express, { Request, Response } from "express";
import { Ticket } from "../model/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const ticket = await Ticket.find({ orderId: undefined });
  res.send(ticket);
});

export default router;
