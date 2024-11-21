import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Asset } from './asset.entity';

@Injectable()
export class AssetRepository extends Repository<Asset> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Asset, dataSource.createEntityManager());
  }

  async getAssets() {
    return this.createQueryBuilder('asset')
      .leftJoin('user', 'user', 'asset.user_id = user.id')
      .select(['asset.* ', 'user.nickname as nickname'])
      .getRawMany();
  }
}
