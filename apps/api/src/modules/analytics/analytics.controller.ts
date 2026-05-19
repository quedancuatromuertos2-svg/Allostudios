import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { AnalyticsService } from "./analytics.service"

@ApiTags("Analytics")
@ApiBearerAuth()
@Controller("businesses/:businessId/analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard KPI stats" })
  getDashboard(@Param("businessId") businessId: string) {
    return this.analyticsService.getDashboardStats(businessId)
  }

  @Get("call-volume")
  @ApiOperation({ summary: "Get call volume over time" })
  getCallVolume(
    @Param("businessId") businessId: string,
    @Query("days") days?: number,
  ) {
    return this.analyticsService.getCallVolume(businessId, days)
  }

  @Get("hourly")
  @ApiOperation({ summary: "Get hourly call distribution" })
  getHourly(
    @Param("businessId") businessId: string,
    @Query("days") days?: number,
  ) {
    return this.analyticsService.getHourlyDistribution(businessId, days)
  }

  @Get("recent-calls")
  @ApiOperation({ summary: "Get recent calls" })
  getRecentCalls(
    @Param("businessId") businessId: string,
    @Query("limit") limit?: number,
  ) {
    return this.analyticsService.getRecentCalls(businessId, limit)
  }
}
