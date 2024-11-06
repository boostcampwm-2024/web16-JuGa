import { Controller, Post, Get, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto);
  }

  @Get('/login')
  loginWithCredentials(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ) {
    return this.authService.loginUser(authCredentialsDto);
  }
}
