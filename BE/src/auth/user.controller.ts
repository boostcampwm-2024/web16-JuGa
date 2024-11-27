import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { RenameUserDto } from './dto/rename-user.dto';

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

  @Post('/rename')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저 닉네임 변경 API',
  })
  @ApiBody({
    type: RenameUserDto,
  })
  @ApiBearerAuth()
  renameUser(@Req() request: Request, @Body() body: RenameUserDto) {
    const userId = parseInt(request.user.userId, 10);
    const newName = body.nickname;

    return this.userService.renameUser(userId, newName);
  }
}
