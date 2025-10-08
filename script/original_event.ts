import { Kafka } from 'kafkajs';
import * as dotenv from 'dotenv';
import { randomBytes } from 'crypto';

dotenv.config();

const kafka = new Kafka({
  clientId: 'event-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

// Generate unique event ID
const generateEventId = () => `evt_${randomBytes(8).toString('hex')}`;

const sampleEvent = {
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
};

async function sendEvent() {
  try {
    await producer.connect();
    console.log('Connected to Kafka');

    const topic = process.env.KAFKA_TOPIC || 'product-events';

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(sampleEvent),
        },
      ],
    });

    console.log('✅ Successfully sent event to Kafka:');
    console.log(JSON.stringify(sampleEvent, null, 2));

    await producer.disconnect();
  } catch (error) {
    console.error('❌ Error sending event:', error);
    process.exit(1);
  }
}

sendEvent();
