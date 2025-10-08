import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NetworkEventsModule } from './network-events/network-events.module';

@Module({
  imports: [NetworkEventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
