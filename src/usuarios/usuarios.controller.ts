import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { UsuarioDTO, UsuarioUpdateDTO } from './DTO/usuario.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { IUsuario } from 'src/common/interfaces/usuarios';
import { UsuariosMSG } from 'src/common/constantes';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('Usuarios')
@Controller('api/v1/usuarios')
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyUsuario = this.clientProxy.clientProxyUsuarios();

  @Roles(Role.Admin, Role.Root)
  @Post()
  async create(@Body() usuarioDTO: UsuarioDTO): Promise<Observable<IUsuario>> {
    const isUsernameExist = await lastValueFrom(
      this._clientProxyUsuario.send(
        UsuariosMSG.FIND_BY_USERNAME,
        usuarioDTO.usuario,
      ),
    );

    if (isUsernameExist) {
      throw new HttpException(
        'El nombre de usuario ya está en uso',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this._clientProxyUsuario.send(UsuariosMSG.CREATE, usuarioDTO);
  }

  @Roles(Role.Admin, Role.Root)
  @Get()
  findAll(): Observable<IUsuario[]> {
    return this._clientProxyUsuario.send(UsuariosMSG.FIND_ALL, '');
  }

  @Roles(Role.Admin, Role.Root)
  @Get(':id')
  findOne(@Param('id') id: string): Observable<IUsuario> {
    return this._clientProxyUsuario.send(UsuariosMSG.FIND_ONE, {
      id: parseInt(id),
    });
  }

  @Roles(Role.Root)
  @Put(':id')
  async update(@Param('id') id: string, @Body() usuarioDTO: UsuarioUpdateDTO) {
    const user = await lastValueFrom(
      this._clientProxyUsuario.send(UsuariosMSG.FIND_ONE, {
        id: parseInt(id),
      }),
    );

    if (!user)
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
      
    return this._clientProxyUsuario.send(UsuariosMSG.UPDATE, {
      id_usuario: parseInt(id),
      data: usuarioDTO,
    });
  }

  @Roles(Role.Root)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this._clientProxyUsuario.send(UsuariosMSG.DELETE, parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId/change-password')
  async changePassword(@Body() body: any, @Param('userId') id: string) {
    const { clave, nuevaClave } = body;

    const user = await lastValueFrom(
      this._clientProxyUsuario.send(UsuariosMSG.FIND_ONE, {
        id: parseInt(id),
        includePass: true,
      }),
    );

    if (!user)
      throw new HttpException('El usuarios no existe', HttpStatus.NOT_FOUND);

    const isMatchPassword = await bcrypt.compare(clave, user.clave);

    if (!isMatchPassword)
      throw new HttpException(
        'La contraseña es incorrecta',
        HttpStatus.BAD_REQUEST,
      );

    return this._clientProxyUsuario.send(UsuariosMSG.CHANGE_PASSWORD, {
      id_usuario: parseInt(id),
      clave: nuevaClave,
    });
  }

  @Roles(Role.Root, Role.Admin)
  @Patch(':userId/reset-password')
  async resetPassword(
    @Body('clave') clave: string,
    @Param('userId') id: string,
  ) {
    const user = await lastValueFrom(
      this._clientProxyUsuario.send(UsuariosMSG.FIND_ONE, {
        id: parseInt(id),
        includePass: true,
      }),
    );

    if (!user)
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);

    return this._clientProxyUsuario.send(UsuariosMSG.CHANGE_PASSWORD, {
      id_usuario: parseInt(id),
      clave: clave,
    });
  }
}
