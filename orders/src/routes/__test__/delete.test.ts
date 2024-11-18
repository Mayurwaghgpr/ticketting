import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import { Order } from "../../model/order";
import { OrderStatus } from "@ticketwithspread/common";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signup();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signup();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  console.log("reciv ord", order);

  // make a request to cancel the order
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);
  console.log({ response });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
