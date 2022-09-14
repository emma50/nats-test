import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()

// client connection to nats-streaming-server
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

// emit a connect event
stan.on('connect', () => {
  console.log('Publisher connected to NATS')

  const data = {
    id: '1234',
    title: 'concert',
    price: 20
  }

  // publish an event
  const publisher = new TicketCreatedPublisher(stan)
  publisher.publish(data)
})