import { Injectable, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { DATABASE_POOL } from './database.module';

@Injectable()
export class NetworkEventsService {
  constructor(@Inject(DATABASE_POOL) private pool: Pool) {}

  async getAllEvents(eventType?: string): Promise<any[]> {
     // 
    // Your code here
    // 


    return [];
  }
}
