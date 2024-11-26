import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_stocks')
@Unique(['user_id', 'stock_code'])
export class UserStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  stock_code: string;

  @Column({ nullable: false })
  quantity: number;

  @Column('float', { nullable: false, scale: 2 })
  avg_price: number;

  @UpdateDateColumn()
  last_updated: Date;
}
