import { Controller, Get, Query } from '@nestjs/common';
import { NetworkEventsService } from './network-events.service';

@Controller('api/network-events')
export class NetworkEventsController {
  constructor(private readonly networkEventsService: NetworkEventsService) {}

  @Get()
  getEvents(@Query('fromDate') fromDate: string) {
    const timestamp = fromDate ? parseInt(fromDate, 10) : Date.now();
    return this.networkEventsService.getEventsSince(timestamp);
  }
}
