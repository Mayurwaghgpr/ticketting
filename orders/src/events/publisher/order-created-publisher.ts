import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@ticketwithspread/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
