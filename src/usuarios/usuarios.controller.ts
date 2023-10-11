import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { UsuarioDTO } from './DTO/usuario.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { IUsuario } from 'src/common/interfaces/usuarios';
import { PersonaNaturalMSG, UsuariosMSG } from 'src/common/constantes';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Usuarios')
@Controller('api/v1/usuarios')
export class UsuariosController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clietProxyUsuario = this.clientProxy.clientProxyUsuarios();
  private _clientProxyPersonaNatural = this.clientProxy.clientProxyPersonaNatural();

  @Roles(Role.Admin, Role.Root)
  @Post()
  async create(@Body() usuarioDTO: UsuarioDTO): Promise<Observable<IUsuario>> {
    const isUsernameExist = await lastValueFrom(
      this._clietProxyUsuario.send(
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

    const isPersonaNaturalExist = await lastValueFrom(
      this._clietProxyUsuario.send(
        PersonaNaturalMSG.FIND_ONE,
        usuarioDTO.dui,
      ),
    );

    if (!isPersonaNaturalExist) {
      throw new HttpException(
        'Persona natural no existe',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this._clietProxyUsuario.send(UsuariosMSG.CREATE, usuarioDTO);
  }

  @Roles(Role.Admin, Role.Root)
  @Get()
  findAll(): Observable<IUsuario[]> {
    return this._clietProxyUsuario.send(UsuariosMSG.FIND_ALL, '');
  }

  @Roles(Role.Admin, Role.Root)
  @Get(':id')
  findOne(@Param('id') id: string): Observable<UsuarioDTO> {
    return this._clietProxyUsuario.send(UsuariosMSG.FIND_ONE, parseInt(id));
  }

  @Roles(Role.Root)
  @Put(':id')
  update(@Param('id') id: string, @Body() usuarioDTO: UsuarioDTO) {
    return this._clietProxyUsuario.send(UsuariosMSG.UPDATE, {
      id_usuario: parseInt(id),
      usuarioDTO,
    });
  }

  @Roles(Role.Root)
  @Delete('id')
  delete(@Param('id') id: string) {
    return this._clietProxyUsuario.send(UsuariosMSG.DELETE, parseInt(id));
  }
}
