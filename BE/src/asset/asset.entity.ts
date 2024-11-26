import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const INIT_ASSET = 10000000;

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false, default: INIT_ASSET })
  cash_balance: number;

  @Column({ nullable: false, default: 0 })
  stock_balance: number;

  @Column({ nullable: false, default: INIT_ASSET })
  total_asset: number;

  @Column({ nullable: false, default: 0 })
  total_profit: number;

  @Column('decimal', { nullable: false, default: 0, precision: 10, scale: 2 })
  total_profit_rate: number;

  @Column({ nullable: true })
  last_updated?: Date;

  @Column({ default: INIT_ASSET })
  prev_total_asset?: number;
}
