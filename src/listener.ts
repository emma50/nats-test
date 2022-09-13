import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

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

  // create subscription options
  const options = stan.subscriptionOptions()
    .setManualAckMode(true)

  // create subscription
  const subscription = stan.subscribe(
    'ticket:created',
    'order-service-queue-group',
    options
  )

  // listen to the message event off subscription
  subscription.on('message', (msg: Message) => {
    console.log('Message received... Listening to the pubished event')

    const data =  msg.getData()
    
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data ${data}`)
    }

    msg.ack()
  })
})

// Nodejs runtime process listening to the interrupt signal
process.on('SIGINT', () => stan.close())

// Nodejs runtime process listening to the terminate signal
process.on('SIGTERM', () => stan.close())