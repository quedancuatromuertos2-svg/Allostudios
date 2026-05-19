import { NestFactory } from "@nestjs/core"
import { ValidationPipe, Logger } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import helmet from "helmet"
import * as compression from "compression"
import { AppModule } from "./app.module"

async function bootstrap() {
  const logger = new Logger("Bootstrap")
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  })

  const configService = app.get(ConfigService)

  // Security
  app.use(helmet())
  app.use(compression())

  // CORS
  app.enableCors({
    origin: [
      configService.get("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })

  // Global prefix
  app.setGlobalPrefix("api")

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // Swagger
  if (configService.get("NODE_ENV") !== "production") {
    const config = new DocumentBuilder()
      .setTitle("VoiceFlow AI API")
      .setDescription("AI Voice Agent SaaS Platform API")
      .setVersion("1.0")
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api/docs", app, document)
    logger.log("Swagger docs: http://localhost:3001/api/docs")
  }

  const port = configService.get("PORT", 3001)
  await app.listen(port)
  logger.log(`VoiceFlow AI API running on port ${port}`)
}

bootstrap()
