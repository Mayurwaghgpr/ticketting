import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@ticketwithspread/common";
import { app } from "../../app";
import { Order } from "../../models/order";
import { rzpInstance } from "../../rezpy";
import { Payment } from "../../models/payments";

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "asldkfj",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "asldkfj",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup(userId))
    .send({
      orderId: order.id,
      token: "asdlkfj",
    })
    .expect(400);
});

// it("returns a 201 with valid inputs", async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const price = Math.floor(Math.random() * 100000);
//   const order = Order.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     userId,
//     version: 0,
//     price,
//     status: OrderStatus.Created,
//   });
//   await order.save();
//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signup(userId))
//     .send({
//       razorpayPaymentId: "pay_DaaSOvhgcOfzgR",
//       razorpayOrderId: "7JS8SH",
//       razorpaySignature: "mock_signature",
//       orderId: order.id,
//     })
//     .expect(201);

//   const razorpayOrders = await rzpInstance.orders.all({ count: 50 });
//   const razorpayOrder = razorpayOrders.items.find((charge) => {
//     return charge.amount === price * 100;
//   });

//   expect(razorpayOrder).toBeDefined();
//   expect(razorpayOrder!.currency).toEqual("inr");

//   const payment = await Payment.findOne({
//     orderId: order.id,
//     stripeId: razorpayOrder!.id,
//   });
//   expect(payment).not.toBeNull();
// });
