import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
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
  loginWithCredentials(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ) {
    return this.authService.loginUser(authCredentialsDto);
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
  async kakaoLogin(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.kakaoLoginUser(authCredentialsDto);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('isRefreshToken', true, { httpOnly: true });
    return res.redirect(this.configService.get<string>('CLIENT_URL'));
  }

  @ApiOperation({ summary: 'Refresh Token 요청 API' })
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    if (
      typeof req.cookies.refreshToken !== 'string' ||
      typeof req.cookies.accessToken !== 'string'
    ) {
      return res.status(400).send();
    }

    const { refreshToken } = req.cookies;

    const newAccessToken = await this.authService.refreshToken(refreshToken);

    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    res.cookie('isRefreshToken', true, { httpOnly: true });
    return res.status(200).send();
  }
}
