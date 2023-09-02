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
} from 'src/common/constantes';
import { IJuntaReceptoraVotos } from 'src/common/interfaces/junta-receptora-votos';

@ApiTags('Junta Receptora Votos')
@Controller('api/v1/junta-receptora-votos')
export class JuntaReceptoraVotosController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyJuntaReceptoraVotos =
    this.clientProxy.clientProxyJuntaReceptoraVotos();
  private _clientProxyCentroVotacion =
    this.clientProxy.clientProxyCentrosVotacion();

  @Post()
  async create(
    @Body() juntaReceptoraVotosDTO: JuntaReceptoraVotosDTO,
  ): Promise< Observable<IJuntaReceptoraVotos>> {
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

  @Get(':idJRV/miembros')
  getMembersByJRVId(@Param('id_jrv') id_jrv: string): Observable<any> {
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.GET_MEMBERS_BY_JRV,
      id_jrv,
    );
  }

  @Get(':idJRV/miembros/:idMiembros')
  getMemberById(
    @Param('id_jrv') id_jrv: string,
    @Param('id_miembro') id_jrv_miembro: string,
  ): Observable<any> {
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.GET_MEMBER_BY_ID,
      { id_jrv, id_jrv_miembro },
    );
  }

  @Post(':idJRV/miembros')
  createMember(
    @Param('id_jrv') id_jrv: string,
    @Body() miembroData: any,
  ): Observable<any> {
    return this._clientProxyJuntaReceptoraVotos.send(
      JuntaReceptoraVotosMSG.CREATE_MEMBER,
      { id_jrv, miembroData },
    );
  }
}
