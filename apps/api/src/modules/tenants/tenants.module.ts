import { Module } from "@nestjs/common"
import { TenantsController } from "./tenants.controller"
import { TenantsService } from "./tenants.service"
import { TemplatesModule } from "../templates/templates.module"

@Module({
  imports: [TemplatesModule],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
