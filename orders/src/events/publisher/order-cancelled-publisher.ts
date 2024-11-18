import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@ticketwithspread/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
