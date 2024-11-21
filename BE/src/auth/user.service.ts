import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return new ProfileResponseDto(user.nickname, user.email);
  }
}
