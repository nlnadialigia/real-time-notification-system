import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {LoggerModule} from 'nestjs-pino';
import {AuthModule} from './auth/auth.module';
import {NotificationsModule} from './notifications/notifications.module';
import {UsersModule} from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    AuthModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
