import { IsString, IsOptional, IsEmail, IsDateString } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateAppointmentDto {
  @ApiProperty()
  @IsString()
  customerName: string

  @ApiProperty()
  @IsString()
  customerPhone: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  customerEmail?: string

  @ApiProperty()
  @IsDateString()
  scheduledAt: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serviceId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  staffId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  callId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
