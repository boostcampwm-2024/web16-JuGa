import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  stock_code: string;

  @Column({ nullable: false })
  user_id: number;
}
