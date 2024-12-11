import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed(@Query("insert", new ParseIntPipe({ optional: true })) insert: number) {
    return this.seedService.executedSeed(insert);
  }
}
