require('dotenv').config();
const { Kafka } = require('kafkajs');
const { randomBytes } = require('crypto');

// Kafka setup
const kafka = new Kafka({
  clientId: 'new-event-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

// Generate unique event ID
const generateEventId = () => `evt_${randomBytes(8).toString('hex')}`;

// Generate sample product.purchased event with NEW fields
const generateNewEvent = () => ({
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
  // NEW FIELDS that don't exist in the original schema
  discountCode: 'SUMMER2025',
  discountAmount: 20.00,
  taxAmount: 10.99,
  shippingAddress: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'USA',
  },
  metadata: {
    source: 'mobile_app',
    sessionId: 'sess_xyz789',
    ipAddress: '192.168.1.100',
  },
});

async function sendEvent() {
  const topic = process.env.KAFKA_TOPIC || 'product-events';
  const event = generateNewEvent();

  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });
    console.log(`📤 Sent NEW event (product.purchased with extra fields): ${event.eventId} at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('Error sending event:', error);
  }
}

async function run() {
  try {
    await producer.connect();
    console.log('✅ Producer connected to Kafka');
    console.log('🚀 Auto-sending product.purchased events (with NEW fields) every 10 seconds...\n');

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
