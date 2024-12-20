import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  nickname: string;

  @Column({ default: false })
  tutorial: boolean;

  @Column({ default: '' })
  kakaoId: string;

  @Column({ default: '' })
  currentRefreshToken: string;

  @Column({ type: 'datetime', nullable: true })
  currentRefreshTokenExpiresAt: Date;

  toAuthCredentialsDto(): AuthCredentialsDto {
    if (this.kakaoId === '') {
      return {
        email: this.email,
        password: this.password,
      };
    }

    throw new Error('Cannot convert Kakao user to auth credentials');
  }
}
