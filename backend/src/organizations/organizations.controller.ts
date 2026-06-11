import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve organizations with pagination and search' })
  @ApiResponse({ status: 200, description: 'List of organizations retrieved' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.organizationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization details by ID' })
  @ApiResponse({ status: 200, description: 'Organization details retrieved' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization details' })
  @ApiResponse({ status: 200, description: 'Organization successfully updated' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(
      id,
      updateOrganizationDto,
    );
  }

  @Post(':id/delete') // Or standard Delete
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an organization' })
  @ApiResponse({ status: 200, description: 'Organization successfully soft deleted' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}