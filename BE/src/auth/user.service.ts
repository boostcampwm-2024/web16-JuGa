import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return new ProfileResponseDto(user.nickname, user.email);
  }

  async renameUser(userId: number, newName: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const isDuplicated = await this.userRepository.existsBy({
      nickname: newName,
    });
    if (isDuplicated) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    return this.userRepository.update({ id: userId }, { nickname: newName });
  }
}
