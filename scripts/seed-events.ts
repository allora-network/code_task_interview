import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'coding_task',
});

const EVENT_TYPES = [
  'product.purchased',
  'product.viewed',
  'cart.added',
  'cart.removed',
  'user.login',
  'user.logout',
];

const PRODUCTS = [
  { name: 'Wireless Headphones', category: 'Electronics', price: 129.99 },
  { name: 'Running Shoes', category: 'Sports', price: 89.99 },
  { name: 'Coffee Maker', category: 'Home & Kitchen', price: 79.99 },
  { name: 'Laptop Stand', category: 'Office', price: 49.99 },
  { name: 'Water Bottle', category: 'Sports', price: 24.99 },
  { name: 'Desk Lamp', category: 'Office', price: 39.99 },
  { name: 'Yoga Mat', category: 'Sports', price: 34.99 },
  { name: 'Backpack', category: 'Accessories', price: 59.99 },
];

const SOURCES = ['mobile_app', 'web_app', 'desktop_app'];

function generateRandomEvent() {
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];

  // Generate timestamps spread over the last 24 hours
  const now = new Date();
  const randomHoursAgo = Math.floor(Math.random() * 24);
  const timestamp = new Date(now.getTime() - randomHoursAgo * 60 * 60 * 1000);

  return {
    eventId: `evt_${Math.random().toString(36).substr(2, 9)}`,
    eventType,
    timestamp: timestamp.toISOString(),
    userId: `user_${Math.floor(Math.random() * 1000)}`,
    productId: `prod_${Math.random().toString(36).substr(2, 6)}`,
    productName: product.name,
    category: product.category,
    price: product.price,
    currency: 'USD',
    quantity: Math.floor(Math.random() * 5) + 1,
    metadata: {
      source,
      sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    },
  };
}

async function seedEvents(count: number = 50) {
  console.log(`🌱 Seeding ${count} events...`);

  try {
    for (let i = 0; i < count; i++) {
      const event = generateRandomEvent();

      const query = `
        INSERT INTO product_events (
          event_id, event_type, timestamp, user_id, product_id,
          product_name, category, price, currency, quantity, metadata,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      `;

      const values = [
        event.eventId,
        event.eventType,
        event.timestamp,
        event.userId,
        event.productId,
        event.productName,
        event.category,
        event.price,
        event.currency,
        event.quantity,
        JSON.stringify(event.metadata),
      ];

      await pool.query(query, values);
      console.log(`✓ Created event ${i + 1}/${count}: ${event.eventType} - ${event.productName}`);
    }

    console.log(`\n✅ Successfully seeded ${count} events!`);
    console.log('\nEvent type distribution:');

    // Show distribution
    const result = await pool.query(`
      SELECT event_type, COUNT(*) as count
      FROM product_events
      GROUP BY event_type
      ORDER BY count DESC
    `);

    result.rows.forEach((row: any) => {
      console.log(`  ${row.event_type}: ${row.count}`);
    });

  } catch (error) {
    console.error('❌ Error seeding events:', error);
  } finally {
    await pool.end();
  }
}

// Get count from command line or use default
const count = parseInt(process.argv[2]) || 50;
seedEvents(count);
