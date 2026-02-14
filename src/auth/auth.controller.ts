import {Body, Controller, Post, UnauthorizedException} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('google')
  @ApiOperation({summary: 'Login com Google'})
  @ApiResponse({status: 200, description: 'Retorna JWT e dados do usuário'})
  async googleLogin(@Body('idToken') idToken: string) {
    if (!idToken) {
      throw new UnauthorizedException('Token Google não fornecido');
    }
    return this.authService.validateGoogleToken(idToken);
  }
}
