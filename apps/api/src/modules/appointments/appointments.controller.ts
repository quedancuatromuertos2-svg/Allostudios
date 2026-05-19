import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { AppointmentsService } from "./appointments.service"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"

@ApiTags("Appointments")
@ApiBearerAuth()
@Controller("businesses/:businessId/appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: "Create an appointment" })
  create(
    @Param("businessId") businessId: string,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(businessId, dto)
  }

  @Get()
  @ApiOperation({ summary: "List appointments" })
  findAll(
    @Param("businessId") businessId: string,
    @Query("status") status?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.appointmentsService.findAll(businessId, { status, from, to, page, limit })
  }

  @Get("slots")
  @ApiOperation({ summary: "Get available time slots" })
  getSlots(
    @Param("businessId") businessId: string,
    @Query("serviceId") serviceId: string,
    @Query("date") date: string,
    @Query("staffId") staffId?: string,
  ) {
    return this.appointmentsService.getAvailableSlots(businessId, {
      serviceId,
      date,
      staffId,
    })
  }

  @Get(":id")
  findOne(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
  ) {
    return this.appointmentsService.findOne(businessId, id)
  }

  @Patch(":id/status")
  updateStatus(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body("status") status: string,
  ) {
    return this.appointmentsService.updateStatus(businessId, id, status)
  }
}
