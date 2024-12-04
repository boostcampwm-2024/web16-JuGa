import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { AuthService } from './auth.service';

config();

describe('auth service 테스트', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockAuthCredentials: AuthCredentialsDto = {
    email: 'jindding',
    password: '1234',
  };

  const mockUser: User = {
    id: 1,
    email: 'jindding',
    password: '1234',
    tutorial: false,
    kakaoId: '',
    currentRefreshToken: 'validRefreshToken',
    currentRefreshTokenExpiresAt: null,
    toAuthCredentialsDto: jest.fn().mockReturnValue({
      email: 'jindding',
      password: '1234',
    }),
    nickname: 'testNickname',
    hasId: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    softRemove: jest.fn(),
    recover: jest.fn(),
    reload: jest.fn(),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      registerUser: jest.fn(),
      registerKakaoUser: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('회원가입 요청 시, DB에 회원 정보가 저장된다.', async () => {
    const registerUserSpy = jest.spyOn(userRepository, 'registerUser');
    await authService.signUp(mockAuthCredentials).then(() => {
      expect(registerUserSpy).toHaveBeenCalledWith(mockAuthCredentials);
    });
  });

  describe('로그인 테스트', () => {
    it('DB에 존재하는 이메일과 비밀번호로 로그인 시, 토큰이 발급된다.', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
      /* eslint-disable @typescript-eslint/no-misused-promises */
      /* eslint-disable func-names */
      jest.spyOn(bcrypt, 'compare').mockImplementation(function () {
        return Promise.resolve(true);
      });
      jest.spyOn(configService, 'get').mockReturnValue(process.env.JWT_SECRET);

      const result = await authService.loginUser(mockAuthCredentials);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('DB에 존재하지 않는 이메일로 로그인 시, 에러가 발생한다.', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        authService.loginUser(mockAuthCredentials),
      ).rejects.toThrow();
    });
  });

  describe('카카오 로그인 테스트', () => {
    it('첫 카카오 로그인 시, 회원 가입 후 토큰이 발급된다.', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(userRepository, 'registerKakaoUser')
        .mockResolvedValue(undefined);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await authService.kakaoLoginUser(mockAuthCredentials);

      expect(
        jest.spyOn(userRepository, 'registerKakaoUser'),
      ).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('이미 가입된 카카오 계정으로 로그인 시, 토큰이 발급된다.', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await authService.kakaoLoginUser(mockAuthCredentials);

      expect(jest.spyOn(userRepository, 'registerUser')).not.toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('토큰 발급 테스트', () => {
    it('유효한 리프레시 토큰으로 요청 시 , 새로운 액세스 토큰이 발급된다.', async () => {
      const decodedToken = { email: mockUser.email };
      const mockRefreshToken = mockUser.currentRefreshToken;

      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('newAccessToken');
      jest.spyOn(configService, 'get').mockReturnValue(process.env.JWT_SECRET);

      const result = await authService.refreshToken(mockRefreshToken);

      expect(result).toBe('newAccessToken');
    });

    it('유효하지 않은 리프레시 토큰으로 요청 시, 에러가 발생한다.', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalidToken')).rejects.toThrow();
    });

    it('저장된 리프레시 토큰과 일치하지 않을 경우, UnauthorizedException이 발생한다.', async () => {
      const decodedToken = { email: mockUser.email };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(authService.refreshToken('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
