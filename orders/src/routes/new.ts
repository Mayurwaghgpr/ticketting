import {
  BadRequestError,
  currentUser,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validationRequest,
} from "@ticketwithspread/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";
import { Order } from "../model/order";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  currentUser,
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Please provide Ticket"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    console.log({ ticketId });
    // Find the ticket user trying to find in dataBase
    const ticket = await Ticket.findById(ticketId);
    console.log({ ticket });
    if (!ticket) {
      throw new NotFoundError();
    }
    const orderst = await Order.findOne({ ticket: ticketId });
    console.log(orderst);
    // Make sure that ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the Order and save it to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    console.log({ order });
    console.log(natsWrapper.client.publish); // Should print a Jest mock function

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client)?.publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export default router;
