import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ThrottlerModule } from "@nestjs/throttler"
import { ScheduleModule } from "@nestjs/schedule"
import { PrismaModule } from "./common/prisma/prisma.module"
import { AuthModule } from "./modules/auth/auth.module"
import { TenantsModule } from "./modules/tenants/tenants.module"
import { UsersModule } from "./modules/users/users.module"
import { CallsModule } from "./modules/calls/calls.module"
import { VoiceModule } from "./modules/voice/voice.module"
import { AppointmentsModule } from "./modules/appointments/appointments.module"
import { AnalyticsModule } from "./modules/analytics/analytics.module"
import { BillingModule } from "./modules/billing/billing.module"
import { AutomationsModule } from "./modules/automations/automations.module"
import { TemplatesModule } from "./modules/templates/templates.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    CallsModule,
    VoiceModule,
    AppointmentsModule,
    AnalyticsModule,
    BillingModule,
    AutomationsModule,
    TemplatesModule,
  ],
})
export class AppModule {}
