import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { ConfigService } from '@nestjs/config';

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
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken } =
        await this.getJWTToken(authCredentialsDto);

      this.setCurrentRefreshToken(refreshToken, user.id);

      return { accessToken };
    }
    throw new UnauthorizedException('Please check your login credentials');
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
      ? this.jwtService.sign({ email: authCredentialsDto.email })
      : this.jwtService.sign({ kakaoId: authCredentialsDto.kakaoId });
  }

  async generateRefreshToken(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    if (authCredentialsDto.email) {
      return this.jwtService.sign(
        { email: authCredentialsDto.email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      );
    } else {
      return this.jwtService.sign(
        { kakaoId: authCredentialsDto.kakaoId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      );
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentDate = new Date();
    const salt = await bcrypt.genSalt();
    const currentRefreshToken = await bcrypt.hash(refreshToken, salt);
    const currentRefreshTokenExpiresAt = new Date(
      currentDate.getTime() +
        parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')),
    );

    this.userRepository.update(userId, {
      currentRefreshToken,
      currentRefreshTokenExpiresAt,
    });
  }
}
