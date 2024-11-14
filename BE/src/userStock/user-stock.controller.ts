import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/api/userStock')
@ApiTags('사용자 보유 주식 API')
export class UserStockController {}
