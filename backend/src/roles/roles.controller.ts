import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all available user roles' })
  @ApiResponse({ status: 200, description: 'List of roles retrieved successfully', schema: { type: 'array', items: { type: 'string' } } })
  findAll() {
    return this.rolesService.findAll();
  }
}
