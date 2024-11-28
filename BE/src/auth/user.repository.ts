import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AssetRepository } from '../asset/asset.repository';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly assetRepository: AssetRepository,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async registerUser(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);
      const user = this.create({ email, password: hashedPassword });
      await queryRunner.manager.save(user);

      user.nickname = `익명의 투자자${user.id}`;
      await queryRunner.manager.save(user);

      const asset = this.assetRepository.create({ user_id: user.id });
      await queryRunner.manager.save(asset);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async registerKakaoUser(authCredentialsDto: AuthCredentialsDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { kakaoId } = authCredentialsDto;
      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(String(kakaoId), salt);
      const user = this.create({
        email: hashedPassword,
        kakaoId,
        password: hashedPassword,
      });
      await this.save(user);

      user.nickname = `익명의 투자자${user.id}`;
      await queryRunner.manager.save(user);

      const asset = this.assetRepository.create({ user_id: user.id });
      await queryRunner.manager.save(asset);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
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
