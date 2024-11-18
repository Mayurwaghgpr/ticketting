import {
  expirationCompleteEvent,
  Publisher,
  Subjects,
} from "@ticketwithspread/common";

export class ExpirationCompletePulisher extends Publisher<expirationCompleteEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
