import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: '회원 가입 API' })
  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({ summary: '로그인 API' })
  @Post('/login')
  async loginWithCredentials(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(authCredentialsDto);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isRefreshToken', true, { httpOnly: true });
    return res.status(200).json({ accessToken });
  }

  @ApiOperation({ summary: 'Token 인증 테스트 API' })
  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@Req() req: Request) {
    return req;
  }

  @ApiOperation({ summary: 'Kakao 로그인 API' })
  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const authCredentialsDto: AuthCredentialsDto = {
      email: req.user.email,
      kakaoId: req.user.kakaoId,
    };
    const { accessToken, refreshToken } =
      await this.authService.kakaoLoginUser(authCredentialsDto);

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isRefreshToken', true, { httpOnly: true });
    return res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }

  @ApiOperation({ summary: 'Refresh Token 요청 API' })
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    if (
      typeof req.cookies.refreshToken !== 'string' ||
      typeof req.cookies.accessToken !== 'string'
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { refreshToken } = req.cookies;

    const newAccessToken = await this.authService.refreshToken(refreshToken);

    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isRefreshToken', true, { httpOnly: true });
    return res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }
}
