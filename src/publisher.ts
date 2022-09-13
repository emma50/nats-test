import nats from 'node-nats-streaming'

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
    ticket: 'concert',
    price: 20
  }

  // data must be stringified
  const JSONData = JSON.stringify(data)

  // publish data
  stan.publish('ticket:created', JSONData, () => {
    console.log('Event published.')
  })
})