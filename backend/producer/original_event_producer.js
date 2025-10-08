require('dotenv').config();
const { Kafka } = require('kafkajs');
const { randomBytes } = require('crypto');

// Kafka setup
const kafka = new Kafka({
  clientId: 'event-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

// Generate unique event ID
const generateEventId = () => `evt_${randomBytes(8).toString('hex')}`;

// Generate sample event
const generateSampleEvent = () => ({
  eventId: generateEventId(),
  eventType: 'product.purchased',
  timestamp: new Date().toISOString(),
  userId: 'user_12345',
  productId: 'prod_abc123',
  productName: 'Wireless Headphones',
  category: 'Electronics',
  price: 129.99,
  currency: 'USD',
  quantity: 2,
  metadata: {
    source: 'mobile_app',
    sessionId: 'sess_xyz789',
    ipAddress: '192.168.1.100',
  },
});

async function sendEvent() {
  const topic = process.env.KAFKA_TOPIC || 'product-events';
  const event = generateSampleEvent();

  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });
    console.log(`📤 Sent event: ${event.eventId} at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('Error sending event:', error);
  }
}

async function run() {
  try {
    await producer.connect();
    console.log('✅ Producer connected to Kafka');
    console.log('🚀 Auto-sending events every 10 seconds...\n');

    // Send first event immediately
    await sendEvent();

    // Send event every 10 seconds
    setInterval(sendEvent, 10000);
  } catch (error) {
    console.error('Error in producer:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async (error) => {
    try {
      console.log(`process.on ${type}`);
      console.error(error);
      await producer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      console.log(`\nReceived ${type}, shutting down gracefully...`);
      await producer.disconnect();
    } finally {
      process.exit(0);
    }
  });
});

run();
