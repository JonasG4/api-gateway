import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Autenticacion')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() user: any) {
    const usuario = await this.authService.validateUser(
      user.usuario,
      user.clave,
    );
    return await this.authService.signIn(usuario);
  }
}
