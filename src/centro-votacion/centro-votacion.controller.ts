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
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Centro Votacion')
@Controller('api/v1/centro-votacion')
export class CentroVotacionController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyCentroVotacion =
    this.clientProxy.clientProxyCentrosVotacion();
  private _clientProxyJrv = this.clientProxy.clientProxyJuntaReceptoraVotos();

  @Roles(Role.Admin, Role.Root)
  @Post()
  async create(
    @Body() centroVotacionDTO: CentroVotacionDTO,
  ): Promise<Observable<ICentroVotacion>> {
    const centroNombreExiste = await lastValueFrom(
      this._clientProxyCentroVotacion.send(
        CentrosVotacionMSG.FIND_ONE_BY_NAME,
        centroVotacionDTO.nombre,
      ),
    );

    if (centroNombreExiste)
      throw new HttpException(
        'Centro de votación ya posee este nombre',
        HttpStatus.NOT_FOUND,
      );

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

  @Roles(Role.Admin, Role.Root)
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

  @Roles(Role.Root)
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

  @Roles(Role.Admin, Role.Root)
  @Patch(':id/cambiar-estado')
  async changeStatus(
    @Param('id') id: string,
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
      id: parseInt(id)
    });
  }
}
