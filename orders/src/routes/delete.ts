import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@ticketwithspread/common";
import express, { Request, Response } from "express";
import { Order } from "../model/order";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
router.delete(
  "/api/orders/:orderId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    console.log({ req });
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");
    console.log({ order });
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;

    console.log(natsWrapper.client.publish); // Should print a Jest mock function

    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });
    res.status(204).send(order);
  }
);
export default router;
