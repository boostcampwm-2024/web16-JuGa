import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MarketType } from './enum/market-type';

@Entity('stocks')
export class Stock {
  @PrimaryColumn()
  code: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: MarketType,
    nullable: false,
  })
  market: MarketType;
}
