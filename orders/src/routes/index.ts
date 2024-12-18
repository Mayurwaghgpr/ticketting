import { currentUser, requireAuth } from "@ticketwithspread/common";
import express, { Request, Response } from "express";
import { Order } from "../model/order";

const router = express.Router();
router.get(
  "/api/orders",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      "ticket"
    );
    res.status(200).send(orders);
  }
);

export default router;
