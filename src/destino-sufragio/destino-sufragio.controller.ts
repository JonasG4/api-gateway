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
import { Observable, lastValueFrom } from 'rxjs';
import { DestinoSufragioDTO } from './DTO/destino-sufragio.dto';
import {
  DestinoSufragioMSG,
  JrvMiembrosMSG,
  PersonaNaturalMSG,
} from 'src/common/constantes';
import { IDestinoSufragio } from 'src/common/interfaces/destino-sufragio';

@ApiTags('destino-sufragio')
@Controller('api/v1/destino-sufragio')
export class DestinoSufragioController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyDestinoSufragio =
    this.clientProxy.clientProxyDestinoSufragio();
  private _clientProxyJrv = this.clientProxy.clientProxyJuntaReceptoraVotos();
  private _clientProxyPersonaNatural =
    this.clientProxy.clientProxyPersonaNatural();

  @Post()
  async create(
    @Body() destinoSufragioDTO: DestinoSufragioDTO,
  ): Promise<Observable<IDestinoSufragio>> {
    const { id_jrv, id_personas_natural } = destinoSufragioDTO;

    const jrv = await lastValueFrom(
      this._clientProxyJrv.send(JrvMiembrosMSG.FIND_ONE, id_jrv),
    );

    if (!jrv)
      throw new HttpException('JRV no encontrado', HttpStatus.NOT_FOUND);

    const personaNatural = await lastValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_ONE,
        id_personas_natural,
      ),
    );

    if (!personaNatural)
      throw new HttpException(
        'Persona natural no encontrada',
        HttpStatus.NOT_FOUND,
      );

    return this._clientProxyDestinoSufragio.send(
      DestinoSufragioMSG.CREATE,
      destinoSufragioDTO,
    );
  }

  @Get()
  findAll(): Observable<IDestinoSufragio[]> {
    return this._clientProxyDestinoSufragio.send(
      DestinoSufragioMSG.FIND_ALL,
      '',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Observable<IDestinoSufragio>> {
    const destinoSufragio = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    if (!destinoSufragio)
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );

    return destinoSufragio;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() destinoSufragioDTO: DestinoSufragioDTO,
  ): Promise<Observable<IDestinoSufragio>> {
    const { id_jrv, id_personas_natural } = destinoSufragioDTO;

    const jrv = await lastValueFrom(
      this._clientProxyJrv.send(JrvMiembrosMSG.FIND_ONE, id_jrv),
    );

    if (!jrv)
      throw new HttpException('JRV no encontrado', HttpStatus.NOT_FOUND);

    const personaNatural = await lastValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_ONE,
        id_personas_natural,
      ),
    );

    if (!personaNatural)
      throw new HttpException(
        'Persona natural no encontrada',
        HttpStatus.NOT_FOUND,
      );

    return this._clientProxyDestinoSufragio.send(DestinoSufragioMSG.UPDATE, {
      id: parseInt(id),
      destinoSufragioDTO,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Observable<any>> {
    const destinoSufragio = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    if (!destinoSufragio)
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );
    return this._clientProxyDestinoSufragio.send(
      DestinoSufragioMSG.DELETE,
      parseInt(id),
    );
  }

  @Patch(':id/asistencia/:id_usuario')
  async changeStatus(
    @Param('id') id: string,
    @Param('id_usuario') id_usuario: string,
  ): Promise<Observable<IDestinoSufragio>> {
    const destinoSufragio = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    if (!destinoSufragio)
      throw new HttpException(
        'Centro de votación no encontrado',
        HttpStatus.NOT_FOUND,
      );

    return this._clientProxyDestinoSufragio.send(
      DestinoSufragioMSG.SET_STATUS_VOTE,
      {
        id: parseInt(id),
        id_usuario: parseInt(id_usuario),
      },
    );
  }

  @Get('dui/:dui')
  findByDui(@Param('dui') dui: string): Observable<any[]> {
    return this._clientProxyDestinoSufragio.send(
      DestinoSufragioMSG.FIND_BY_DUI,
      dui,
    );
  }
}
