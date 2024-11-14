import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Stocks extends BaseEntity {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  market: string;
}
