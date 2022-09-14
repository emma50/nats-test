import { Publisher } from './base-publisher'
import { TicketCreatedEvent } from './ticket-created-event'
import { Subjects } from './subjects'

// create ticket publisher
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}