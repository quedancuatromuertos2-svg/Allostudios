import { Controller, Get, Param } from "@nestjs/common"
import { ApiTags, ApiOperation } from "@nestjs/swagger"
import { TemplatesService } from "./templates.service"

@ApiTags("Templates")
@Controller("templates")
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: "Get all niche templates" })
  findAll() {
    return this.templatesService.getAllTemplates()
  }

  @Get(":niche")
  @ApiOperation({ summary: "Get template for a specific niche" })
  findOne(@Param("niche") niche: string) {
    return this.templatesService.getTemplate(niche.toUpperCase())
  }
}
