import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { NetworkEventsController } from './network-events.controller';
import { NetworkEventsService } from './network-events.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NetworkEventsController],
  providers: [NetworkEventsService],
})
export class AppModule {}
