import { Controller, Get, Header } from '@nestjs/common';
import * as client from 'prom-client';

@Controller('metrics')
export class MetricsController {
  private readonly registry = new client.Registry();

  constructor() {
    // Collect default metrics (CPU, heap, etc)
    client.collectDefaultMetrics({ register: this.registry });
  }

  @Get()
  @Header('Content-Type', client.register.contentType)
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
