import { ApiProperty } from '@nestjs/swagger';

export class RenameUserDto {
  @ApiProperty({ description: '변경할 닉네임' })
  nickname: string;
}
