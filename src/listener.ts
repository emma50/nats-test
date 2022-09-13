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

  const subscription = stan.subscribe('ticket:created')

  // listen to the message event off subscription
  subscription.on('message', (msg: Message) => {
    console.log('Message received... Listening to the pubished event')

    const data =  msg.getData()
    
    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data ${data}`)
    }
  })
})