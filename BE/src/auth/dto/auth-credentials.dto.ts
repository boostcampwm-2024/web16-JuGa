import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    description: '유저 이메일',
    minLength: 4,
    maxLength: 20,
    type: 'string',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  email: string;

  @ApiProperty({
    description: '유저 비밀번호',
    minLength: 4,
    maxLength: 20,
    type: 'string',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/)
  password: string;
}
