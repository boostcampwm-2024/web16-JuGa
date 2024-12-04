import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TradeType } from './enum/trade-type';
import { StatusType } from './enum/status-type';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false })
  user_id: number;

  @Index()
  @Column({ nullable: false })
  stock_code: string;

  @Column({
    type: 'enum',
    enum: TradeType,
    nullable: false,
  })
  trade_type: TradeType;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: StatusType,
    nullable: false,
  })
  status: StatusType;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  completed_at?: Date;
}
