import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { DATABASE_POOL } from './database.module';

@Injectable()
export class NetworkEventsService {
  constructor(@Inject(DATABASE_POOL) private pool: Pool) {}

  async getAllEvents(): Promise<any[]> {
    const query = `
      SELECT
        event_id as "eventId",
        event_type as "eventType",
        timestamp,
        user_id as "userId",
        product_id as "productId",
        product_name as "productName",
        category,
        price,
        currency,
        quantity,
        metadata
      FROM product_events
      ORDER BY timestamp DESC
    `;

    const result: QueryResult<any> = await this.pool.query<any>(query);

    return result.rows.map(event => ({
      ...event,
      timestamp: new Date(event.timestamp).toISOString(),
      price: Number(event.price),
    }));
  }
}
