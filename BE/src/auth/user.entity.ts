import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  tutorial: boolean;

  @Column({ default: -1 })
  kakaoId: number;

  @Column({ default: '' })
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  currentRefreshTokenExpiresAt: Date;
}
