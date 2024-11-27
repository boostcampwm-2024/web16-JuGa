import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AssetRepository } from './asset.repository';
import { Asset } from './asset.entity';
import { UserStock } from './user-stock.entity';
import { UserStockRepository } from './user-stock.repository';
import { StockDetailModule } from '../stock/detail/stock-detail.module';
import { StockSocketModule } from '../stockSocket/stock-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, UserStock]),
    StockDetailModule,
    StockSocketModule,
  ],
  controllers: [AssetController],
  providers: [AssetService, AssetRepository, UserStockRepository],
  exports: [AssetRepository, UserStockRepository],
})
export class AssetModule {}
