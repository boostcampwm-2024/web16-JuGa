import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Controller('/api/user')
@ApiTags('프로필 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 프로필 조회 API' })
  @ApiResponse({
    status: 200,
    description: '프로필 조회 성공',
    type: ProfileResponseDto,
  })
  getProfile(@Req() request: Request) {
    return this.userService.getProfile(parseInt(request.user.userId, 10));
  }
}
