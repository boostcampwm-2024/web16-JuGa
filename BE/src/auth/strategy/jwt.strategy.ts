import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';

interface RequestWithCookies extends Request {
  cookies: {
    accessToken?: string;
    [key: string]: string | undefined;
  };
}

function extractJWTFromCookie(req: RequestWithCookies): string | null {
  if (req.cookies && 'accessToken' in req.cookies) {
    return req.cookies.accessToken;
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: extractJWTFromCookie,
    });
  }

  async validate(payload: { email?: string; kakaoId?: string }): Promise<{
    userId: number;
    email: string;
    tutorial: boolean;
    kakaoId: string | null;
    nickname: string;
  }> {
    const { email, kakaoId } = payload;

    let user: User;

    if (kakaoId) {
      user = await this.userRepository.findOne({
        where: { kakaoId },
      });
      if (!user) throw new UnauthorizedException();
    } else if (email) {
      user = await this.userRepository.findOne({
        where: { email },
      });
    }

    if (!user) throw new UnauthorizedException();

    return {
      nickname: user.nickname,
      userId: user.id,
      email: user.email,
      tutorial: user.tutorial,
      kakaoId: user.kakaoId,
    };
  }
}
