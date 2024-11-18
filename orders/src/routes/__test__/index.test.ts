import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import { OrderStatus } from "@ticketwithspread/common";
import { Order } from "../../model/order";

const buildticket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it("fetch order for an particular user", async () => {
  // create three tickets
  const ticketOne = await buildticket();
  const ticketTwo = await buildticket();
  const ticketThree = await buildticket();

  const userOne = global.signup();
  const userTwo = global.signup();
  // Create one order as User #1
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get specific user
  await request(app).get("/api/orders").set("Cookie", userTwo).expect(200);
  //  Make sure we only got the orders for User #2
  expect(response.body.lenght).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
