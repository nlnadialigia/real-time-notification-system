import {Body, Controller, Get, Param, Patch, Post, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {NotificationsService} from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post()
  @ApiOperation({summary: 'Criar nova notificação'})
  async create(@Body() body: {userId: string; title: string; message: string;}) {
    // Em um cenário real, o userId viria do token ou a notificação seria criada por um sistema admin/evento
    // Aqui permitimos passar o userId no body para testar
    return this.notificationsService.create(body.userId, body.title, body.message);
  }

  @Get()
  @ApiOperation({summary: 'Listar notificações do usuário logado'})
  async findAll(@Request() req) {
    return this.notificationsService.findAllByUser(req.user.userId);
  }

  @Patch(':id/read')
  @ApiOperation({summary: 'Marcar notificação como lida'})
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }
}
