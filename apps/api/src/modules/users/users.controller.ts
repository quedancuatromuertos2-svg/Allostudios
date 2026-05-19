import { Controller, Get, Post, Body } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { UsersService } from "./users.service"
import { CurrentUser } from "../../common/decorators/current-business.decorator"

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@CurrentUser() user: any) {
    return user
  }

  @Post("sync")
  syncFromClerk(@Body() data: any) {
    return this.usersService.upsertFromClerk(data)
  }
}
