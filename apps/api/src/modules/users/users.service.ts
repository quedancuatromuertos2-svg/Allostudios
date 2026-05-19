import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../common/prisma/prisma.service"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async upsertFromClerk(data: {
    clerkId: string
    email: string
    name: string
    avatarUrl?: string
  }) {
    return this.prisma.user.upsert({
      where: { clerkId: data.clerkId },
      update: { email: data.email, name: data.name, avatarUrl: data.avatarUrl },
      create: data,
    })
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({ where: { clerkId } })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }
}
