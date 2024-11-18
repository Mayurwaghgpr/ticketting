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
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  async onMessage(data: expirationCompleteEvent["data"], msg: Message) {
    console.log({ data });
    const order = await Order.findById(data.orderId).populate("ticket");
    console.log({ order });
    if (!order) {
      console.log("first");
      throw new Error("Order not Found");
    }
    if (order.status === OrderStatus.Complete) {
      console.log("not cancelled");
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
