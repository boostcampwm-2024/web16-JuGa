import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TopfiveController } from './topfive.controller';
import { TopFiveService } from './topfive.service';

@Module({
  imports: [ConfigModule],
  controllers: [TopfiveController],
  providers: [TopFiveService],
})
export class TopfiveModule {}
