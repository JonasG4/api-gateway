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
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { Observable, lastValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { JuntaReceptoraVotosDTO } from './DTO/junta-receptora-votos.dto';
import {
  CentrosVotacionMSG,
  JuntaReceptoraVotosMSG,
  PersonaNaturalMSG,
} from 'src/common/constantes';
import { IJuntaReceptoraVotos } from 'src/common/interfaces/junta-receptora-votos';
import { IJrvMiembro } from 'src/common/interfaces/miembro-jrv';
import { JrvMiembroDTO } from './DTO/miembro-jrv.dto';

@ApiTags('Junta Receptora Votos')
@Controller('api/v1/junta-receptora-votos')
export class JuntaReceptoraVotosController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyJuntaReceptoraVotos =
    this.clientProxy.clientProxyJuntaReceptoraVotos();
  private _clientProxyCentroVotacion =
    this.clientProxy.clientProxyCentrosVotacion();
    private _clientProxyPersonaNatural =
    this.clientProxy.clientProxyPersonaNatural();

  @Post()
  async create(
    @Body() juntaReceptoraVotosDTO: JuntaReceptoraVotosDTO,
  ): Promise<Observable<IJuntaReceptoraVotos>> {
    const { id_centro_votacion } = juntaReceptoraVotosDTO;
    const centro_votacion = await lastValueFrom(
      this._clientProxyCentroVotacion.send(
        CentrosVotacionMSG.FIND_ONE,
        id_centro_votacion,
      ),
    );

    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!centro_votacion) {
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.CREATE,
      juntaReceptoraVotosDTO,
    );
  }

  @Get()
  findAll(): Observable<IJuntaReceptoraVotos[]> {
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.FIND_ALL,
      '',
    );
  }

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

  @Put(':id')
  async update(
    @Body() juntaReceptoraVotosDTO: JuntaReceptoraVotosDTO,
    @Param('id') id: string,
  ): Promise<Observable<IJuntaReceptoraVotos>> {
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

  @Get(':id_jrv/miembros/:idMiembros')
  async getMemberById(
    @Param('id_jrv') id_jrv: string,
    @Param('id_miembro') id_jrv_miembro: string,
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
      JuntaReceptoraVotosMSG.GET_MEMBER_BY_ID,
      { id_jrv: parseInt(id_jrv), id_jrv_miembro: parseInt(id_jrv_miembro) },
    );
  }

  @Post('miembro')
  async createMember(
    @Body() miembroData: JrvMiembroDTO,
  ): Promise<Observable<IJrvMiembro>> {
    const { id_jrv, id_persona_natural } = miembroData;
    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        id_jrv,
      ),
    );

    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const countMembersJRV = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.GET_MEMBERS_BY_JRV,
        id_jrv,
      ),
    );

    if(countMembersJRV.length >= 6){
      throw new HttpException(
        'Junta Receptora de Votos llena',
        HttpStatus.NOT_FOUND,
      );
    }

    const memberExist = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.GET_MEMBERS_BY_ID_PERSONA_NATURAL,
        {id_jrv, id_persona_natural}
      ),
    );

    if(memberExist != undefined){
      throw new HttpException(
        'Junta Receptora de Votos ya posee ese usuario',
        HttpStatus.NOT_FOUND,
      );
    }

    const naturalPersonExist = await lastValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_ONE,
        id_persona_natural
      ),
    );

    if(!naturalPersonExist){
      throw new HttpException(
        'Persona natural no existe',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.CREATE_MEMBER,
      miembroData,
    );
  }

  @Put('miembro/:id_jrv_miembro')
  async updateMember(
    @Body() miembroData: JrvMiembroDTO,
    @Param('id_jrv_miembro') id_jrv_miembro: string,
  ): Promise<Observable<IJrvMiembro>> {
    const { id_jrv } = miembroData;

    const juntaReceptoraVotos = await lastValueFrom(
      this._clientProxyJuntaReceptoraVotos.send(
        JuntaReceptoraVotosMSG.FIND_ONE,
        id_jrv,
      ),
    );
    if (!juntaReceptoraVotos) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.UPDATE_MEMBER,
      { id_jrv_miembro: parseInt(id_jrv_miembro), miembroData },
    );
  }

  @Delete('miembro/:id_jrv_miembro')
  async deleteMember(
    @Param('id_jrv_miembro') id_jrv_miembro: string,
  ): Promise<Observable<IJrvMiembro>> {
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.DELETE_MEMBER,
      parseInt(id_jrv_miembro),
    );
  }
}
