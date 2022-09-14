import { Message, Stan } from 'node-nats-streaming'

export abstract class Listener {
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
