# Coding Interview Task

## Background
You have a working Kafka consumer that processes `product.purchased` events from a Kafka topic and stores them in a Postgres database.

## Your Task
The product team wants to add new fields to the `product.purchased` events to track discounts and shipping information.

Your job is to:

1. **Update the database schema** - Create a migration to support the new fields
2. **Update the consumer** - Modify the consumer to handle and store the new fields
3. **Ensure backwards compatibility** - Old events (without the new fields) should still work

## Updated Event Schema

The `product.purchased` events will now include these **additional fields**:

```json
{
  "eventId": "evt_abc123def456",
  "eventType": "product.purchased",
  "timestamp": "2025-10-08T15:30:22.456Z",
  "userId": "user_12345",
  "productId": "prod_abc123",
  "productName": "Wireless Headphones",
  "category": "Electronics",
  "price": 129.99,
  "currency": "USD",
  "quantity": 2,
  "metadata": {
    "source": "mobile_app",
    "sessionId": "sess_xyz789",
    "ipAddress": "192.168.1.100"
  }

  // NEW FIELDS BELOW
  "discountCode": "SUMMER2025",
  "discountAmount": 20.00,
  "taxAmount": 10.99,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "USA"
  },
}
```

## Getting Started

1. **Verify the current setup works:**
   ```bash
   npm run backend:old
   ```
   This starts a producer sending the **original** `product.purchased` events (without the new fields) every 10 seconds and a consumer processing them. You should see events being sent and stored successfully.

2. **Make your changes:**
   - Create migration(s) to add the new fields to the existing table
   - Update consumer code to handle the new fields
   - Update the model(s) as needed

3. **Test your solution:**

   Stop the current setup (Ctrl+C) and run:
   ```bash
   npm run backend:new
   ```

   This sends `product.purchased` events **with the new fields** every 10 seconds. If your implementation is correct, you should see these events being processed and stored successfully.

4. **Verify backwards compatibility:**

   Run `npm run backend:old` again to ensure old events (without new fields) still work after your migration.

5. **Verify in database:**
   ```bash
   docker exec -it postgres_db psql -U postgres -d coding_task -c "SELECT * FROM product_events;"
   ```

## Design Considerations

Think about:
- How should you handle the new fields in the migration? (nullable vs non-nullable)
- The `shippingAddress` is a nested object - how will you store it?
- How do you ensure old events (without the new fields) continue to work?
- Should the new fields have default values?

## Deliverables

1. Migration file(s) in `database/migrations/`
2. Updated consumer logic in `backend/consumer/index.js`
3. Updated or new model file(s) in `backend/models/`

## Available Commands

- `npm run backend:old` - Producer (original schema) + consumer
- `npm run backend:new` - Producer (new schema with extra fields) + consumer
- `npm run consumer` - Start only the consumer
- `npm run db:migrate` - Run migrations
- `npm run db:migrate:down` - Rollback last migration
- `npm run db:migration:create -- migration-name` - Create new migration

Good luck! 🚀
