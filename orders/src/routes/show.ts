import express, { Request, Response } from "express";
import { Order } from "../model/order";
import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
} from "@ticketwithspread/common";

const router = express.Router();
router.get(
  "/api/orders/:orderId",
  currentUser,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    console.log(req);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.send(order);
  }
);

export default router;
