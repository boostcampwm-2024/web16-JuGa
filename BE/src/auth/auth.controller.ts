import { Controller, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
}
