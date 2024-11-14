import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AssetRepository } from './asset.repository';
import { Asset } from './asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [AssetController],
  providers: [AssetService, AssetRepository],
  exports: [AssetRepository],
})
export class AssetModule {}
