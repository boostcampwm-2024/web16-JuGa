import { BaseEntity, Column, Entity } from 'typeorm';

@Entity()
export class Stock extends BaseEntity {
  @Column({ primary: true })
  code: string;

  @Column()
  name: string;

  @Column()
  market: string;
}
