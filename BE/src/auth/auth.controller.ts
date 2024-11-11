import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @UseGuards(AuthGuard())
  test(@Req() req: Request) {
    return req;
  }
}
