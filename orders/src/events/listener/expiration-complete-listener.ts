import {
  expirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@ticketwithspread/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<expirationCompleteEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: expirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      console.log("first");
      throw new Error("Order not Found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    console.log(this.client.publish);
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    new OrderCancelledPublisher(this.client)?.publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
