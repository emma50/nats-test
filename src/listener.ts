import nats, { Message, Stan } from 'node-nats-streaming'
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

  new TicketCreatedListener(stan).listen()
})

// Nodejs runtime process listening to the interrupt signal
process.on('SIGINT', () => stan.close())

// Nodejs runtime process listening to the terminate signal
process.on('SIGTERM', () => stan.close())


abstract class Listener {
  // must be defined by a sub-class
  abstract subject: string
  abstract queueGroupName: string
  abstract onMessage(data: any, msg: Message): void

  private client: Stan
  protected ackWait = 5 * 1000

  constructor(client: Stan) {
    this.client = client
  }

  // create subscriptionOptions
  subscriptionOptions() {
    return this.client.subscriptionOptions()
    .setDeliverAllAvailable()
    .setManualAckMode(true)
    .setAckWait(this.ackWait)
    .setDurableName(this.queueGroupName)
  }

  listen() {
    // create subscription
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    subscription.on('message', (msg: Message) => {
      console.log(`Message received... ${this.subject} / ${this.queueGroupName}`)

      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg)
    })
  }

  parseMessage(msg: Message) {
    const data =  msg.getData()

    return typeof data === 'string'
      ? data
      : JSON.parse(data.toString('utf-8'))
  }
}

// create ticket listener
class TicketCreatedListener extends Listener {
  subject = 'ticket:created'
  queueGroupName = 'payment-service'

  onMessage (data: any, msg: Message) {
    console.log(`Event data! ${data}`)

    msg.ack()
  }
}