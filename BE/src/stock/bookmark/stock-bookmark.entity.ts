import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('bookmarks')
@Unique(['user_id', 'stock_code'])
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  stock_code: string;

  @Column({ nullable: false })
  user_id: number;
}
