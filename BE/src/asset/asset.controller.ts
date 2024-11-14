import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/api/assets')
@ApiTags('자산 API')
export class AssetController {}
