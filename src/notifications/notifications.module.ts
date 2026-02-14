import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AuthModule} from '../auth/auth.module';
import {PrismaModule} from '../prisma/prisma.module';
import {NotificationsController} from './notifications.controller';
import {NotificationsGateway} from './notifications.gateway';
import {NotificationsService} from './notifications.service';

@Module({
  imports: [PrismaModule, AuthModule, JwtModule],
  providers: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController],
})
export class NotificationsModule { }
