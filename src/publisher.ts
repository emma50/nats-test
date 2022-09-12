import nats from 'node-nats-streaming'

// client connection to nats-streaming-server
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

// emit a connect event
stan.on('connect', () => {
  console.log('Publisher connected to NATS')
})