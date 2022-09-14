import { Message } from 'node-nats-streaming'
import { Listener } from './base-listener'

// create ticket listener
export class TicketCreatedListener extends Listener {
  subject = 'ticket:created'
  queueGroupName = 'payment-service'

  onMessage (data: any, msg: Message) {
    console.log(`Event data! ${data}`)

    msg.ack()
  }
}