import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {NotificationsGateway} from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) { }

  async create(userId: string, title: string, message: string) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });

    // Enviar via WebSocket
    this.notificationsGateway.sendNotification(userId, notification);

    return notification;
  }

  async findAllByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: {userId},
      orderBy: {createdAt: 'desc'},
    });
  }
}
