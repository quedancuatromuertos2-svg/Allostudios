import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const businessId =
      request.params.businessId || request.body.businessId

    if (!user || !businessId) return false

    const membership = await this.prisma.businessUser.findUnique({
      where: {
        userId_businessId: { userId: user.id, businessId },
      },
    })

    if (!membership) throw new ForbiddenException("Access denied to this business")

    request.businessMembership = membership
    return true
  }
}
