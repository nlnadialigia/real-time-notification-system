import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {OAuth2Client} from 'google-auth-library';
import {UsersService} from '../users/users.service';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async validateGoogleToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Token inválido');

      const {sub: googleId, email, name, picture} = payload;

      if (!email) throw new UnauthorizedException('Email não fornecido pelo Google');

      const user = await this.usersService.findOrCreate(googleId, email, name, picture);

      const payloadJwt = {sub: user.id, email: user.email};

      return {
        accessToken: this.jwtService.sign(payloadJwt),
        user,
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Token Google inválido');
    }
  }
}
