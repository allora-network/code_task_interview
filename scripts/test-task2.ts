#!/usr/bin/env ts-node

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

async function testTask2() {
  try {
    console.log('Testing: GET /api/network-events?eventType=product.viewed\n');
    
    const response = await fetch(`${API_BASE_URL}/api/network-events?eventType=product.viewed`);
    const events = await response.json() as any[];
    
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(`Returned: ${events.length} events`);
    
    if (events.length === 0) {
      console.log('\n❌ Task 2 NOT Complete! No events returned.');
      console.log('Make sure you have seeded data: npm run db:seed');
      process.exit(1);
    }
    
    console.log('\n✅ Task 2 Complete!');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    console.error('Make sure the API is running: npm run dev:backend');
    process.exit(1);
  }
}

testTask2();

