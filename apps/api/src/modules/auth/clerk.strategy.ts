import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { UsersService } from "../users/users.service"

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, "clerk") {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (req: any) => {
        const authHeader = req.headers.authorization
        if (!authHeader) return null
        return authHeader.split(" ")[1]
      },
      secretOrKey: config.get("CLERK_SECRET_KEY", ""),
      algorithms: ["RS256"],
    })
  }

  async validate(payload: any) {
    const user = await this.usersService.findByClerkId(payload.sub)
    if (!user) throw new UnauthorizedException()
    return user
  }
}
