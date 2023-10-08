import {
  Controller,
  Body,
  Delete,
  Get,
  Post,
  Patch,
  Put,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { CentroVotacionDTO, EstadoDTO } from './DTO/centro-votacion.dto';
import { CentrosVotacionMSG } from 'src/common/constantes';
import { ICentroVotacion } from 'src/common/interfaces/centro-votacion';
import { Observable, lastValueFrom } from 'rxjs';

@ApiTags('centro-votacion')
@Controller('api/v1/centro-votacion')
export class CentroVotacionController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyCentroVotacion =
    this.clientProxy.clientProxyCentrosVotacion();
  private _clientProxyJrv = this.clientProxy.clientProxyJuntaReceptoraVotos();

  @Post()
  create(
    @Body() centroVotacionDTO: CentroVotacionDTO,
  ): Observable<ICentroVotacion> {
    return this._clientProxyCentroVotacion.send(
      CentrosVotacionMSG.CREATE,
      centroVotacionDTO,
    );
  }

  @Get()
  findAll(): Observable<ICentroVotacion[]> {
    return this._clientProxyCentroVotacion.send(
      CentrosVotacionMSG.FIND_ALL,
      '',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Observable<ICentroVotacion>> {
    (id);
    (parseInt(id));

    const centroVotacion = await lastValueFrom(
      this._clientProxyCentroVotacion.send(
        CentrosVotacionMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    if (!centroVotacion)
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );

    return centroVotacion;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() centroVotacionDTO: CentroVotacionDTO,
  ): Promise<Observable<ICentroVotacion>> {
    const centroVotacion = await lastValueFrom(
      this._clientProxyCentroVotacion.send(
        CentrosVotacionMSG.FIND_ONE,
        parseInt(id),
      ),
    );
    if (!centroVotacion)
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );

    return this._clientProxyCentroVotacion.send(CentrosVotacionMSG.UPDATE, {
      id: parseInt(id),
      centroVotacionDTO,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Observable<any>> {
    const centroVotacion = await lastValueFrom(
      this._clientProxyCentroVotacion.send(
        CentrosVotacionMSG.FIND_ONE,
        parseInt(id),
      ),
    );
    if (!centroVotacion)
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );
    return this._clientProxyCentroVotacion.send(
      CentrosVotacionMSG.DELETE,
      parseInt(id),
    );
  }

  @Patch(':id/cambiar-estado')
  async changeStatus(
    @Param('id') id: string,
    @Body('estado') estado: EstadoDTO,
  ): Promise<Observable<ICentroVotacion>> {
    const centroVotacion = await lastValueFrom(
      this._clientProxyCentroVotacion.send(
        CentrosVotacionMSG.FIND_ONE,
        parseInt(id),
      ),
    );
    if (!centroVotacion)
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );

    return this._clientProxyCentroVotacion.send(CentrosVotacionMSG.SET_STATUS, {
      id: parseInt(id),
      estado,
    });
  }
}
