import {Injectable} from '@nestjs/common';
import {User} from '@prisma/client';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOrCreate(googleId: string, email: string, name?: string, picture?: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {googleId},
    });

    if (user) {
      return user;
    }

    return this.prisma.user.create({
      data: {
        googleId,
        email,
        name,
        picture,
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {id},
    });
  }
}
