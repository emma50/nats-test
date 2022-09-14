import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TicketCreatedListener } from './events/ticket-created-listener'

console.clear()

// connection to nats-streaming-server
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

// listen to a connect event
stan.on('connect', () => {
  console.log('Listener connected to NATS')

  // listen to a client connection close event and exit process gracefully
  stan.on('close', () => {
    console.log('NATS connection closed')
    process.exit()
  })

  new TicketCreatedListener(stan).listen()
})

// Nodejs runtime process listening to the interrupt signal
process.on('SIGINT', () => stan.close())

// Nodejs runtime process listening to the terminate signal
process.on('SIGTERM', () => stan.close())
