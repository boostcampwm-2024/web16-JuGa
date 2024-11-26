import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { UserRepository } from '../user.repository';

interface KakaoStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

interface KakaoProfile extends Profile {
  id: number;
  _json: {
    id: number;
    kakao_account: {
      email: string;
    };
  };
}

interface KakaoUser {
  kakaoId: number;
  userId: number;
  email: string;
  tutorial: boolean;
  nickname: string;
}

@Injectable()
export class KakaoStrategy extends PassportStrategy<Strategy>(
  Strategy,
  'kakao',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    const options: KakaoStrategyOptions = {
      clientID: configService.get<string>('KAKAO_CLIENT_ID') || '',
      clientSecret: '',
      callbackURL: `${configService.get<string>('BACKEND_URL') || ''}/api/auth/kakao`,
    };

    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: KakaoProfile,
    done: (error: Error, user?: KakaoUser) => void,
  ) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const kakaoId = profile._json.id;

      const user = await this.userRepository.findOne({
        where: { kakaoId: kakaoId.toString() },
      });
      if (!user) {
        throw new Error('User not found');
      }

      done(null, {
        userId: user.id,
        email: user.email,
        tutorial: user.tutorial,
        kakaoId: Number(user.kakaoId),
        nickname: user.nickname,
      });
    } catch (error) {
      done(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
