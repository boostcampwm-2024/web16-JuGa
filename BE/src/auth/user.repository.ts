import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async registerUser(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);
    const user = this.create({ email, password: hashedPassword });
    await this.save(user);
  }

  async registerKakaoUser(authCredentialsDto: AuthCredentialsDto) {
    const { kakaoId, email } = authCredentialsDto;
    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(String(kakaoId), salt);
    const user = this.create({ email, kakaoId, password: hashedPassword });
    await this.save(user);
  }

  async updateUserWithRefreshToken(
    id: number,
    {
      refreshToken,
      refreshTokenExpiresAt,
    }: { refreshToken: string; refreshTokenExpiresAt: Date },
  ) {
    const user = await this.findOne({ where: { id } });
    user.currentRefreshToken = refreshToken;
    user.currentRefreshTokenExpiresAt = refreshTokenExpiresAt;
    await this.save(user);
  }
}
