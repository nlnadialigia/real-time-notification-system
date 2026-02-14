import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Mapa de userId -> socketId(s)
  // Simplificação: 1 usuário = 1 socket (ou broadcast para sala do user)

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  afterInit(server: Server) {
    console.log('WebSocket Server Initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const userId = payload.sub;
      client.join(userId); // Entra na sala com o ID do usuário
      console.log(`Client connected: ${client.id} (User: ${userId})`);

    } catch (e) {
      console.error('WebSocket connection unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendNotification(userId: string, notification: any) {
    this.server.to(userId).emit('notification', notification);
  }
}
