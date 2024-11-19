import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { Asset } from 'src/asset/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/common/redis/redis.module';
import { RedisDomainService } from 'src/common/redis/redis.domain-service';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), RedisModule],
  controllers: [RankingController],
  providers: [RankingService, RedisDomainService],
})
export class RankingModule {}
