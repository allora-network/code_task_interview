import { Module } from '@nestjs/common';
import { NetworkEventsController } from './network-events.controller';
import { NetworkEventsService } from './network-events.service';

@Module({
  controllers: [NetworkEventsController],
  providers: [NetworkEventsService],
  exports: [NetworkEventsService],
})
export class NetworkEventsModule {}
