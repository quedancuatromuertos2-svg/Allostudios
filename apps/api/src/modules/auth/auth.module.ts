import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { ClerkStrategy } from "./clerk.strategy"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES_IN", "7d") },
      }),
    }),
    UsersModule,
  ],
  providers: [ClerkStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
