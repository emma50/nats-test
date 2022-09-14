import { Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects,
  data: any,
}
export abstract class Publisher<T extends Event> {
  // abstract: must be defined by a sub-class

  // subject: a channel to publish an event to i.e ticket-created
  abstract subject: T['subject']
  private client: Stan

  constructor(client: Stan) {
    this.client = client
  }

  publish(data: T['data']): Promise<void> {
    // publish an event with data
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        return err ? reject(err) 
          : resolve(console.log( `Even published to subject: ${this.subject}`))
      })
    })
  }
}
