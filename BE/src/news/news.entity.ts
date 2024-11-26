import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  originallink: string;

  @Column()
  description: string;

  @Column({ name: 'pub_date' })
  pubDate: Date;

  @Column()
  query: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
