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

// Validate that the model can handle all fields in the event
function validateEventFields(event) {
  const modelAttributes = Object.keys(productEventModel.model.rawAttributes);

  // Convert camelCase model attributes to match event field names
  const modelFields = modelAttributes.map(attr => {
    // Convert from camelCase to the actual event field name
    if (attr === 'eventId') return 'eventId';
    if (attr === 'eventType') return 'eventType';
    if (attr === 'userId') return 'userId';
    if (attr === 'productId') return 'productId';
    if (attr === 'productName') return 'productName';
    return attr;
  });

  // Get all top-level fields from the event (excluding metadata as it's JSONB and flexible)
  const eventFields = Object.keys(event).filter(key => key !== 'metadata');

  // Check for fields in the event that aren't in the model
  const unknownFields = eventFields.filter(field => !modelFields.includes(field));

  if (unknownFields.length > 0) {
    throw new Error(
      `Event contains fields that are not defined in the database schema: ${unknownFields.join(', ')}. ` +
      `Please run a migration to add these fields to the table.`
    );
  }
}

async function processMessage(message) {
  try {
    const event = JSON.parse(message.value.toString());

    console.log('Processing event:', event.eventId);

    // Validate that we can handle all fields in the event
    validateEventFields(event);

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

    let isFlushed = false;

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // Skip processing during flush
        if (!isFlushed) return;

        console.log(`📥 Received message from ${topic}[${partition}]`);
        await processMessage(message);
      },
    });

    // Wait a moment for partition assignment, then flush old messages
    await new Promise(resolve => setTimeout(resolve, 2000));

    const admin = kafka.admin();
    await admin.connect();

    const topicOffsets = await admin.fetchTopicOffsets(topic);

    for (const partition of topicOffsets) {
      await consumer.seek({
        topic,
        partition: partition.partition,
        offset: partition.high,
      });
    }

    await admin.disconnect();

    isFlushed = true;
    console.log('🧹 Flushed old messages, listening for new events only...\n');
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
