import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDTO } from './DTO/auth.dto';

@ApiTags('Autenticacion')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() user: AuthDTO) {

    const usuario = await this.authService.validateUser(
      user.usuario,
      user.clave,
    );

    if (!usuario)
      throw new HttpException(
        'El usuario o la contraseña son incorrectos',
        HttpStatus.FORBIDDEN,
      );

    return await this.authService.signIn(usuario);
  }
}
