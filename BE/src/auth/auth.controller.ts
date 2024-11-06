import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
