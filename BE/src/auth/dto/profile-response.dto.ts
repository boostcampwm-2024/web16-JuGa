import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  @ApiProperty({ description: '사용자 이름' })
  name: string;

  @ApiProperty({ description: '사용자 이메일' })
  email: string;
}
