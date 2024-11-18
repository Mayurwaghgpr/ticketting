import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import { OrderStatus } from "@ticketwithspread/common";
import { Order } from "../../model/order";

it("fetch the order", async () => {
  // Created a ticket

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    title: "concert",
    price: 302,
  });
  await ticket.save();
  const user = global.signup();

  // Make a request to build an order with this ticket
  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  //  Make request to fetch the order
  await request(app)
    .get(`/api/orders/${body.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);
});

it("return error if we fetch another users order", async () => {
  // Created a ticket

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 302,
  });
  await ticket.save();
  const user = global.signup();

  // Make a request to build an order with this ticket
  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  //  Make request to fetch the order
  console.log(global.signup());
  await request(app)
    .get(`/api/orders/${body.id}`)
    .set("Cookie", global.signup())
    .send()
    .expect(401);
});
