import express, { Request, Response } from "express";
import {
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
  validationRequest,
  currentUser,
  BadRequestError,
} from "@ticketwithspread/common";
import { Ticket } from "../model/ticket";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publish";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.put(
  "/api/tickets/:id",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provide and must be greater than 0"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title: req.body.title, price: req.body.price });
    await ticket.save();
    console.log(natsWrapper.client.publish); // Should print a Jest mock function

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export default router;
