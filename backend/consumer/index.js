require('dotenv').config();
const { Kafka } = require('kafkajs');
const { Sequelize } = require('sequelize');
const ProductEvent = require('../models/product-event');

// Database setup
const sequelize = new Sequelize(
  process.env.DB_NAME || 'coding_task',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

// Kafka setup
const kafka = new Kafka({
  clientId: 'product-event-consumer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'product-event-group' });
const productEventModel = new ProductEvent(sequelize);

async function processMessage(message) {
  try {
    const event = JSON.parse(message.value.toString());

    console.log('Processing event:', event.eventId);

    await productEventModel.create(event);

    console.log('Successfully stored event:', event.eventId);
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
}

async function run() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Connect to Kafka
    await consumer.connect();
    console.log('✅ Consumer connected to Kafka');

    // Subscribe to topic
    const topic = process.env.KAFKA_TOPIC || 'product-events';
    await consumer.subscribe({ topic, fromBeginning: false });
    console.log(`✅ Subscribed to topic: ${topic}`);
    console.log('🎧 Listening for events...\n');

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`📥 Received message from ${topic}[${partition}]`);
        await processMessage(message);
      },
    });
  } catch (error) {
    console.error('Error in consumer:', error);
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
      await consumer.disconnect();
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
      await consumer.disconnect();
    } finally {
      process.exit(0);
    }
  });
});

run();
