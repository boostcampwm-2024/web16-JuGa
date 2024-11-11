import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    description: '유저 이메일',
  })
  @IsString()
  email?: string;

  @ApiProperty({
    description: '유저 비밀번호',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 영문과 숫자만 사용가능합니다',
  })
  password?: string;

  @ApiProperty({
    description: '카카오 ID',
  })
  @IsString()
  @IsOptional()
  kakaoId?: string;

  @ApiProperty({
    description: '카카오 액세스 토큰',
  })
  @IsString()
  @IsOptional()
  kakaoAccessToken?: string;
}
