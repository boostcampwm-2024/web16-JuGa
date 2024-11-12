import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.registerUser(authCredentialsDto);
  }

  async loginUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken } =
        await this.getJWTToken(authCredentialsDto);

      await this.setCurrentRefreshToken(refreshToken, user.id);

      return { accessToken, refreshToken };
    }
    throw new UnauthorizedException('Please check your login credentials');
  }

  async kakaoLoginUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { kakaoId: authCredentialsDto.kakaoId },
    });

    if (!user) {
      await this.userRepository.registerKakaoUser(authCredentialsDto);
    }
    return this.getJWTToken(authCredentialsDto);
  }

  async getJWTToken(authCredentialsDto: AuthCredentialsDto) {
    const accessToken = await this.generateAccessToken(authCredentialsDto);
    const refreshToken = await this.generateRefreshToken(authCredentialsDto);
    return { accessToken, refreshToken };
  }

  async generateAccessToken(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    return authCredentialsDto.email
      ? this.jwtService.signAsync({ email: authCredentialsDto.email })
      : this.jwtService.signAsync({ kakaoId: authCredentialsDto.kakaoId });
  }

  async generateRefreshToken(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    if (authCredentialsDto.email) {
      return this.jwtService.signAsync(
        { email: authCredentialsDto.email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      );
    }
    return this.jwtService.signAsync(
      { kakaoId: authCredentialsDto.kakaoId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      },
    );
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentDate = new Date();
    const salt = await bcrypt.genSalt();
    const currentRefreshToken = await bcrypt.hash(refreshToken, salt);
    const currentRefreshTokenExpiresAt = new Date(
      currentDate.getTime() +
        parseInt(
          this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
          10,
        ),
    );

    await this.userRepository.update(userId, {
      currentRefreshToken,
      currentRefreshTokenExpiresAt,
    });
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = decodedRefreshToken.email
        ? await this.userRepository.findOne({
            where: { email: decodedRefreshToken.email },
          })
        : await this.userRepository.findOne({
            where: { kakaoId: decodedRefreshToken.kakaoId },
          });

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.currentRefreshToken,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid Token');
      }

      const accessToken = this.generateAccessToken(user.toAuthCredentialsDto());
      return await accessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
