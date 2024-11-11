import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

interface KakaoStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

interface KakaoProfile extends Profile {
  id: number;
  _json: {
    id: number;
  };
}

interface KakaoUser {
  kakaoId: number;
}

@Injectable()
export class KakaoStrategy extends PassportStrategy<Strategy>(
  Strategy,
  'kakao',
) {
  constructor(private readonly configService: ConfigService) {
    const options: KakaoStrategyOptions = {
      clientID: configService.get<string>('KAKAO_CLIENT_ID') || '',
      clientSecret: '',
      callbackURL: `${configService.get<string>('BACKEND_URL') || ''}/auth/kakao`,
    };

    super(options);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: KakaoProfile,
    done: (error: Error, user?: KakaoUser) => void,
  ) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const kakaoId = profile._json.id;
      const user = {
        kakaoId,
      };
      done(null, user);
    } catch (error) {
      done(error instanceof Error ? error : new Error(String(error)));
    }
  }
}