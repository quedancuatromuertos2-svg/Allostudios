import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { CallsService } from "./calls.service"

@ApiTags("Calls")
@ApiBearerAuth()
@Controller("businesses/:businessId/calls")
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  @ApiOperation({ summary: "List calls for a business" })
  findAll(
    @Param("businessId") businessId: string,
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.callsService.findAll(businessId, { status, page, limit })
  }

  @Get(":id")
  @ApiOperation({ summary: "Get call details" })
  findOne(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
  ) {
    return this.callsService.findOne(businessId, id)
  }
}
