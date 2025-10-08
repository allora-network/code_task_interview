import { Controller, Get } from '@nestjs/common';
import { NetworkEventsService } from './network-events.service';

@Controller('api/network-events')
export class NetworkEventsController {
  constructor(private readonly networkEventsService: NetworkEventsService) {}

  @Get()
  async getEvents() {
    return await this.networkEventsService.getAllEvents();
  }
}
