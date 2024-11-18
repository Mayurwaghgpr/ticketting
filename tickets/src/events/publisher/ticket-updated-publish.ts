import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@ticketwithspread/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
