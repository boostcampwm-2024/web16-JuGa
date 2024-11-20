import { Module } from '@nestjs/common';
import { Asset } from 'src/asset/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/common/redis/redis.module';
import { RedisDomainService } from 'src/common/redis/redis.domain-service';
import { AssetRepository } from 'src/asset/asset.repository';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), RedisModule],
  controllers: [RankingController],
  providers: [RankingService, RedisDomainService, AssetRepository],
})
export class RankingModule {}
