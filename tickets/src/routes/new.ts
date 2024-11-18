import {
  currentUser,
  requireAuth,
  validationRequest,
} from "@ticketwithspread/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("this is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than 0"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    console.log(req.currentUser);
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).send(ticket);
  }
);

export default router;
