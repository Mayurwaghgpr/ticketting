import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@ticketwithspread/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
