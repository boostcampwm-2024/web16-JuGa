import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_stocks')
export class UserStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  stock_code: string;

  @Column({ nullable: false })
  quantity: number;

  @Column('decimal', { nullable: false, precision: 10, scale: 5 })
  avg_price: number;

  @UpdateDateColumn()
  last_updated: Date;
}
