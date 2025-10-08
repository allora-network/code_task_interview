import { Injectable } from '@nestjs/common';

export interface NetworkEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  userId: string;
  productId: string;
  productName: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
  metadata: {
    source: string;
    sessionId: string;
    ipAddress: string;
  };
}

@Injectable()
export class NetworkEventsService {
  private events: NetworkEvent[] = [];

  private readonly eventTypes = [
    'product.purchased',
    'product.viewed',
    'cart.added',
    'cart.removed',
    'user.login',
    'user.logout',
  ];

  private readonly products = [
    { name: 'Wireless Headphones', category: 'Electronics', price: 129.99 },
    { name: 'Running Shoes', category: 'Sports', price: 89.99 },
    { name: 'Coffee Maker', category: 'Home & Kitchen', price: 79.99 },
    { name: 'Laptop Stand', category: 'Office', price: 49.99 },
    { name: 'Water Bottle', category: 'Sports', price: 24.99 },
    { name: 'Desk Lamp', category: 'Office', price: 39.99 },
  ];

  private readonly sources = ['mobile_app', 'web_app', 'desktop_app'];

  private generateMockEvent(): NetworkEvent {
    const product =
      this.products[Math.floor(Math.random() * this.products.length)];
    const eventType =
      this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];
    const source = this.sources[Math.floor(Math.random() * this.sources.length)];

    return {
      eventId: `evt_${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      timestamp: new Date().toISOString(),
      userId: `user_${Math.floor(Math.random() * 10000)}`,
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

  getEventsSince(timestamp: number): NetworkEvent[] {
    // Generate 1-3 random mock events
    const numberOfEvents = Math.floor(Math.random() * 3) + 1;
    const newEvents: NetworkEvent[] = [];

    for (let i = 0; i < numberOfEvents; i++) {
      const event = this.generateMockEvent();
      this.events.push(event);
      newEvents.push(event);
    }

    // Return events that occurred after the given timestamp
    return this.events.filter(
      (event) => new Date(event.timestamp).getTime() > timestamp,
    );
  }

  addEvent(event: NetworkEvent) {
    this.events.push(event);
  }
}
