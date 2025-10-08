# Task 2: Event Filtering API

## Overview
Implement a GET endpoint that allows consumers to retrieve network events filtered by event type.

## Your Task
Complete the `getAllEvents` method in `backend/rest-api/src/network-events.service.ts` to:
- Fetch all events from the database when no filter is provided
- Filter events by `eventType` when the query parameter is present

## Endpoint
```
GET /api/network-events?eventType=product.viewed
```

## Getting Started

### 1. Seed the Database
```bash
npm run db:seed
```

### 2. Implement the Function
Edit `backend/rest-api/src/network-events.service.ts` and implement the `getAllEvents` method.

**Hints:**
- Use `this.pool.query()` to execute SQL queries
- Handle the optional `eventType` parameter
- Return an array of events

### 3. Test Your Implementation
```bash
npm run test:task2
```

## Expected Behavior
- Without filter: Returns all events
- With filter: Returns only events matching the specified `eventType`
- Example: `?eventType=product.viewed` returns only "product.viewed" events

## Success Criteria
✅ The test script returns successfully  
✅ Events are properly filtered by type  
✅ The endpoint handles both filtered and unfiltered requests

