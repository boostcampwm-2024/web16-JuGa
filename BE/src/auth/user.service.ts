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

    this.validateName(newName);
    await this.checkNameDuplicate(newName);

    return this.userRepository.update({ id: userId }, { nickname: newName });
  }

  private validateName(nickname: string) {
    const regex = /^[가-힣a-zA-Z0-9]+$/;
    if (!regex.test(nickname)) {
      throw new BadRequestException('한글, 영문, 숫자만 사용 가능합니다.');
    }

    if (nickname.includes('익명의투자자')) {
      throw new BadRequestException('사용 불가능한 단어가 포함되어 있습니다.');
    }
  }

  private async checkNameDuplicate(nickname: string) {
    const isDuplicated = await this.userRepository.existsBy({
      nickname,
    });
    if (isDuplicated) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }
  }
}
