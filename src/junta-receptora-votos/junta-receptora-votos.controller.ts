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
} from '@nestjs/common';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { Observable, last, lastValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { JuntaReceptoraVotosDTO } from './DTO/junta-receptora-votos.dto';
import {
  CentrosVotacionMSG,
  JuntaReceptoraVotosMSG,
  PersonaNaturalMSG,
  UsuariosMSG,
} from 'src/common/constantes';
import { IJuntaReceptoraVotos } from 'src/common/interfaces/junta-receptora-votos';
import { IJrvMiembro } from 'src/common/interfaces/miembro-jrv';
import { JrvMiembroDTO } from './DTO/miembro-jrv.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Junta Receptora Votos')
@Controller('api/v1/junta-receptora-votos')
export class JuntaReceptoraVotosController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyJuntaReceptoraVotos =
    this.clientProxy.clientProxyJuntaReceptoraVotos();
  private _clientProxyCentroVotacion =
    this.clientProxy.clientProxyCentrosVotacion();
  private _clientProxyUsuario = this.clientProxy.clientProxyUsuarios();

  @Roles(Role.Admin, Role.Root)
  @Post()
  async create(
    @Body() juntaReceptoraVotosDTO: JuntaReceptoraVotosDTO,
  ): Promise<Observable<IJuntaReceptoraVotos>> {
    const existeCentroVotacion = await lastValueFrom(
      this._clientProxyCentroVotacion.send(
        CentrosVotacionMSG.FIND_ONE,
        juntaReceptoraVotosDTO.id_centro_votacion,
      ),
    );

    // Si no existe la junta receptora de votos, no se puede crear jrv
    if (!existeCentroVotacion) {
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const existeCodigo = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE_BY_CODE,
        juntaReceptoraVotosDTO.codigo,
      ),
    );

    // Si no existe la junta receptora de votos, no se puede crear jrv
    if (existeCodigo) {
      throw new HttpException(
        'JRV ya existe con ese codigo',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.CREATE,
      juntaReceptoraVotosDTO,
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente, Role.Secretario, Role.Vocal)
  @Get()
  findAll(): Observable<IJuntaReceptoraVotos[]> {
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.FIND_ALL,
      '',
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente, Role.Secretario, Role.Vocal)
  @Get('municipio/:id_municipio')
  async findAllByMunicipio(
    @Param('id_municipio') id_municipio: string,
  ): Promise<Observable<IJuntaReceptoraVotos>> {
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.FIND_ALL_BY_MUNICIPIO,
      { id_municipio: parseInt(id_municipio) },
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente, Role.Secretario, Role.Vocal)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Observable<IJuntaReceptoraVotos>> {
    // Se verifica que exista la junta receptora de votos

    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return juntaReceptoraVotos;
  }

  @Roles(Role.Admin, Role.Root)
  @Put(':id')
  async update(
    @Body() juntaReceptoraVotosDTO: JuntaReceptoraVotosDTO,
    @Param('id') id: string,
  ): Promise<Observable<IJuntaReceptoraVotos>> {
    const existeCentroVotacion = await lastValueFrom(
      this._clientProxyCentroVotacion.send(
        CentrosVotacionMSG.FIND_ONE,
        juntaReceptoraVotosDTO.id_centro_votacion,
      ),
    );

    // Si no existe la junta receptora de votos, no se puede crear jrv
    if (!existeCentroVotacion) {
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.UPDATE,
      {
        id: parseInt(id),
        juntaReceptoraVotosDTO,
      },
    );
  }

  @Roles(Role.Admin, Role.Root)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Observable<any>> {
    // Se verifica que exista la junta receptora de votos
    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.DELETE,
      parseInt(id),
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente)
  @Patch(':id_jrv/cambiar-estado')
  async changeStatus(
    @Param('id_jrv') id_jrv: string,
  ): Promise<Observable<IJuntaReceptoraVotos>> {
    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        parseInt(id_jrv),
      ),
    );
    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.SET_STATUS_JRV,
      {
        id_jrv: parseInt(id_jrv),
      },
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente)
  @Get(':id_jrv/miembros')
  async getMembersByJRVId(
    @Param('id_jrv') id_jrv: string,
  ): Promise<Observable<IJrvMiembro>> {
    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        parseInt(id_jrv),
      ),
    );
    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.GET_MEMBERS_BY_JRV,
      parseInt(id_jrv),
    );
  }

  @Roles(Role.Admin, Role.Root)
  @Get('miembros/todos')
  async getJrvMembers(): Promise<Observable<IJrvMiembro>> {
    console.log('MEMBERS');

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.GET_MEMBERS,
      '',
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente)
  @Get('miembro/:id_jrv_miembro')
  async getMemberById(
    @Param('id_jrv_miembro') id_jrv_miembro: string,
  ): Promise<Observable<IJrvMiembro>> {
    const miembroExist = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.GET_MEMBER_BY_ID,
        {
          id_jrv_miembro: parseInt(id_jrv_miembro),
        },
      ),
    );

    if (!miembroExist) {
      throw new HttpException('Miembro no existe', HttpStatus.NOT_FOUND);
    }

    return miembroExist;
  }

  @Roles(Role.Admin, Role.Root)
  @Post('miembro')
  async createMember(
    @Body() miembroData: JrvMiembroDTO,
  ): Promise<Observable<IJrvMiembro>> {
    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        miembroData.id_jrv,
      ),
    );

    // Si no existe la junta receptora de votos, no se puede crear
    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    //Cuantos miembros posee la mesa
    const countMembersJRV = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.GET_MEMBERS_BY_JRV,
        miembroData.id_jrv,
      ),
    );

    let miembrosActivos = countMembersJRV.filter((miembro) => {
      miembro.estado == 'ACTIVO';
    });

    if (miembrosActivos.length >= 6) {
      throw new HttpException(
        'Junta Receptora de Votos llena',
        HttpStatus.NOT_FOUND,
      );
    }

    //Si el miembro ya existe
    const usuarioExist = await lastValueFrom(
      this._clientProxyUsuario.send(
        UsuariosMSG.FIND_ONE,
        miembroData.id_usuario,
      ),
    );

    if (!usuarioExist) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }

    const usuarioExistEnMesa = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.GET_MEMBER_BY_USER_ID,
        { id_usuario: miembroData.id_usuario, id_jrv: miembroData.id_jrv },
      ),
    );

    if (usuarioExistEnMesa) {
      throw new HttpException(
        'Usuario ya existe en mesa',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.CREATE_MEMBER,
      miembroData,
    );
  }

  @Roles(Role.Admin, Role.Root)
  @Put('miembro/:id_jrv_miembro')
  async updateMember(
    @Body() miembroData: JrvMiembroDTO,
    @Param('id_jrv_miembro') id_jrv_miembro: string,
  ): Promise<Observable<IJrvMiembro>> {
    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        miembroData.id_jrv,
      ),
    );

    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    //Si el miembro ya existe
    const usuarioExist = await lastValueFrom(
      this._clientProxyUsuario.send(
        UsuariosMSG.FIND_ONE,
        miembroData.id_usuario,
      ),
    );

    if (!usuarioExist) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.UPDATE_MEMBER,
      { id_jrv_miembro: parseInt(id_jrv_miembro), miembroData: miembroData },
    );
  }

  @Roles(Role.Admin, Role.Root)
  @Delete('miembro/:id_jrv_miembro')
  async deleteMember(
    @Param('id_jrv_miembro') id_jrv_miembro: string,
  ): Promise<Observable<IJrvMiembro>> {
    const miembroExist = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.GET_MEMBER_BY_ID,
        {
          id_jrv_miembro: parseInt(id_jrv_miembro),
        },
      ),
    );

    if (!miembroExist) {
      throw new HttpException('Miembro no existe', HttpStatus.NOT_FOUND);
    }
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.DELETE_MEMBER,
      parseInt(id_jrv_miembro),
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente)
  @Patch('miembro/:id_jrv_miembro')
  async changeStatusJrvMember(
    @Param('id_jrv_miembro') id_jrv_miembro: string,
  ): Promise<Observable<IJrvMiembro>> {
    const miembroExist = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.GET_MEMBER_BY_ID,
        {
          id_jrv_miembro: parseInt(id_jrv_miembro),
        },
      ),
    );

    if (!miembroExist) {
      throw new HttpException('Miembro no existe', HttpStatus.NOT_FOUND);
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.SET_STATUS_JRV,
      {
        id_jrv_miembro: parseInt(id_jrv_miembro),
      },
    );
  }
}
