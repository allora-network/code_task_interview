import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

export const DATABASE_POOL = 'DATABASE_POOL';

const databasePoolProvider = {
  provide: DATABASE_POOL,
  useFactory: () => {
    return new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'coding_task',
    });
  },
};

@Global()
@Module({
  providers: [databasePoolProvider],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
