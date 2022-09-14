import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects,
  data: any,
}
export abstract class Listener<T extends Event> {
  // abstract: must be defined by a sub-class

  // subject: a channel/event-name to listen or subscribe to i.e ticket-created
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: Message): void

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
