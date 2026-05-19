import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { TenantsService } from "./tenants.service"
import { CreateBusinessDto } from "./dto/create-business.dto"
import { CurrentUser } from "../../common/decorators/current-business.decorator"

@ApiTags("Businesses")
@ApiBearerAuth()
@Controller("businesses")
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new business" })
  create(@CurrentUser() user: any, @Body() dto: CreateBusinessDto) {
    return this.tenantsService.create(user.id, dto)
  }

  @Get()
  @ApiOperation({ summary: "Get all businesses for current user" })
  findAll(@CurrentUser() user: any) {
    return this.tenantsService.findAllForUser(user.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get business details" })
  findOne(@Param("id") id: string) {
    return this.tenantsService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update business settings" })
  update(@Param("id") id: string, @Body() dto: Partial<CreateBusinessDto>) {
    return this.tenantsService.update(id, dto)
  }

  @Patch(":id/ai-config")
  @ApiOperation({ summary: "Update AI agent configuration" })
  updateAIConfig(@Param("id") id: string, @Body() data: any) {
    return this.tenantsService.updateAIConfig(id, data)
  }

  @Get(":id/services")
  @ApiOperation({ summary: "Get business services" })
  getServices(@Param("id") id: string) {
    return this.tenantsService.getServices(id)
  }

  @Get(":id/staff")
  @ApiOperation({ summary: "Get business staff" })
  getStaff(@Param("id") id: string) {
    return this.tenantsService.getStaff(id)
  }
}
