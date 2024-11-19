import {
  BadRequestError,
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validationRequest,
} from "@ticketwithspread/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { rzpInstance } from "../rezpy";
import { Payment } from "../models/payments";
import { PaymentCreatedPublisher } from "../events/publisher/payment-create-publisher";
import { natsWrapper } from "../nats-wrapper";
import crypto from "crypto";
const router = Router();

router.post(
  "/api/payments",
  currentUser,
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validationRequest,
  async (req: Request, res: Response) => {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } =
      req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("cannot pay for cancelled order");
    }
    try {
      // const charge = await rzpInstance.orders.create({
      //   currency: "INR",
      //   amount: order.price * 100,
      // });

      // Verify Razorpay signature
      const generatedSignature = crypto
        .createHmac("sha256", process.env.REZPAY_KEY_SECRET!)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        throw new BadRequestError("Invalid payment signature");
      }
      const payment = Payment.build({
        orderId,
        payId: razorpayPaymentId,
      });

      new PaymentCreatedPublisher(natsWrapper.client)?.publish({
        id: payment.id,
        orderId: payment.orderId,
        payId: payment.payId,
      });
      // Log successful charge creation

      res.status(201).send({ id: payment.id });
    } catch (error) {
      console.error("rzpInstance charge creation failed:", error);
      res.status(500).send({ error: "Payment processing failed" });
    }
  }
);

export { router as createdChargeRouter };
