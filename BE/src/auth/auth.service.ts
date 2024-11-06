import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { bcrypt } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.userRepository.registerUser(authCredentialsDto);
  }
}
