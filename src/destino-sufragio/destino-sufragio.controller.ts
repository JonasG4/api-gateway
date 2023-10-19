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
  CandidatosPoliticosMSG,
  DestinoSufragioMSG,
  JuntaReceptoraVotosMSG,
  PersonaNaturalMSG,
} from 'src/common/constantes';
import { IDestinoSufragio } from 'src/common/interfaces/destino-sufragio';

@ApiTags('Destino Sufragio')
@Controller('api/v1/destino-sufragio')
export class DestinoSufragioController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyDestinoSufragio =
    this.clientProxy.clientProxyDestinoSufragio();
  private _clientProxyJrv = this.clientProxy.clientProxyJuntaReceptoraVotos();
  private _clientProxyPersonaNatural =
    this.clientProxy.clientProxyPersonaNatural();
  private _clientProxyCandidatos =
    this.clientProxy.clientProxyCandidatosPoliticos();

  @Post()
  async create(
    @Body() destinoSufragioDTO: DestinoSufragioDTO,
  ): Promise<Observable<IDestinoSufragio>> {
    const { id_jrv, id_persona_natural } = destinoSufragioDTO;

    const jrv = await lastValueFrom(
      this._clientProxyJrv.send(JuntaReceptoraVotosMSG.FIND_ONE, id_jrv),
    );

    if (!jrv)
      throw new HttpException('JRV no encontrado', HttpStatus.NOT_FOUND);

    const personaNatural = await lastValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_ONE,
        id_persona_natural,
      ),
    );

    if (!personaNatural)
      throw new HttpException(
        'Persona natural no encontrada',
        HttpStatus.NOT_FOUND,
      );

    const existeEnJrv = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.FIND_BY_PERSONA_NATURAL,
        { id_persona_natural: id_persona_natural },
      ),
    );

    if (existeEnJrv)
      throw new HttpException(
        'Votante ya posee destino de sufragio',
        HttpStatus.BAD_REQUEST,
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
      throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND);

    return destinoSufragio;
  }

  @Get('dui/:dui')
  async findByDui(@Param('dui') dui: string): Promise<Observable<any[]>> {
    const personaNaturalDui = await lastValueFrom(
      this._clientProxyPersonaNatural.send(PersonaNaturalMSG.FIND_BY_DUI, dui),
    );

    if (!personaNaturalDui)
      throw new HttpException(
        'Persona natural no encontrada',
        HttpStatus.NOT_FOUND,
      );

    const votante = await this._clientProxyDestinoSufragio.send(
      DestinoSufragioMSG.FIND_BY_DUI,
      dui,
    );

    if (!votante)
      throw new HttpException('Votante no encontrado', HttpStatus.NOT_FOUND);

    return votante;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Observable<any>> {
    const destinoSufragio = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    if (destinoSufragio.uuid != null || destinoSufragio.ledger_id != null)
      throw new HttpException(
        'No se puede eliminar un voto en proceso, emitido o validado!',
        HttpStatus.NOT_FOUND,
      );

    if (!destinoSufragio)
      return this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.DELETE,
        parseInt(id),
      );
  }

  @Post('crear-qr/:dui')
  async crearVoto(
    @Param('dui') dui: string,
  ): Promise<Observable<IDestinoSufragio>> {
    const personaNaturalDui = await lastValueFrom(
      this._clientProxyPersonaNatural.send(PersonaNaturalMSG.FIND_BY_DUI, dui),
    );

    if (!personaNaturalDui)
      throw new HttpException(
        'Persona natural no encontrada',
        HttpStatus.NOT_FOUND,
      );

    const votantePoseeJRV = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.FIND_BY_PERSONA_NATURAL,
        { id_persona_natural: personaNaturalDui.id_persona_natural },
      ),
    );

    if (!votantePoseeJRV)
      throw new HttpException(
        'Votante no posee lugar de votacion',
        HttpStatus.NOT_FOUND,
      );

    if (votantePoseeJRV.jrv.estado == 'CERRADA')
      throw new HttpException('JRV CERRADA!!', HttpStatus.NOT_FOUND);

    if (votantePoseeJRV.jrv.centro_votacion.estado == 'CERRADA')
      throw new HttpException(
        'CENTRO DE VOTACION CERRADO!!',
        HttpStatus.NOT_FOUND,
      );

    if (votantePoseeJRV.ledger_id != null || votantePoseeJRV.uuid_info != null)
      throw new HttpException(
        'Votante ya ingreso a centro de votacion!',
        HttpStatus.NOT_FOUND,
      );

    return this._clientProxyDestinoSufragio.send(
      DestinoSufragioMSG.CREATE_VOTE,
      {
        id_detalle_sufragio: votantePoseeJRV.id_detalle_sufragio,
        genero: personaNaturalDui.genero,
        departamento: personaNaturalDui.municipio.departamentos.nombre,
        municipio: personaNaturalDui.municipio.nombre,
        dui: dui,
        codigo: votantePoseeJRV.jrv.codigo,
      },
    );
  }

  @Put('validar-qr/:dui')
  async validarVoto(
    @Param('dui') dui: string,
  ): Promise<Observable<IDestinoSufragio>> {
    const personaNaturalDui = await lastValueFrom(
      this._clientProxyPersonaNatural.send(PersonaNaturalMSG.FIND_BY_DUI, dui),
    );

    if (!personaNaturalDui)
      throw new HttpException(
        'Persona natural no encontrada',
        HttpStatus.NOT_FOUND,
      );

    const votantePoseeJRV = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.FIND_BY_PERSONA_NATURAL,
        { id_persona_natural: personaNaturalDui.id_persona_natural },
      ),
    );

    if (!votantePoseeJRV)
      throw new HttpException(
        'Votante no posee lugar de votacion',
        HttpStatus.NOT_FOUND,
      );

    if (votantePoseeJRV.jrv.estado == 'CERRADA')
      throw new HttpException('JRV CERRADA!!', HttpStatus.NOT_FOUND);

    if (votantePoseeJRV.jrv.centro_votacion.estado == 'CERRADA')
      throw new HttpException(
        'CENTRO DE VOTACION CERRADO!!',
        HttpStatus.NOT_FOUND,
      );

    if (votantePoseeJRV.ledger_id == null || votantePoseeJRV.uuid_info == null)
      throw new HttpException(
        'Votante no valido, regresar a paso #1',
        HttpStatus.NOT_FOUND,
      );

    const verificarEstadoVoto = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.VERIFY_STATUS_VOTE,
        {
          ledger_id: votantePoseeJRV.ledger_id,
        },
      ),
    );

    let lastIndex = verificarEstadoVoto.length - 1;
    if (
      verificarEstadoVoto[lastIndex].data.estado === 0 &&
      verificarEstadoVoto[lastIndex].data.status === 0 &&
      verificarEstadoVoto[lastIndex].data.events.status === 0
    ) {
      return this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.VALIDATE_VOTE,
        {
          ledger_id: votantePoseeJRV.ledger_id,
          id_detalle_sufragio: votantePoseeJRV.id_detalle_sufragio,
        },
      );
    } else {
      throw new HttpException(
        'Votante no valido, dirigirse a JRV para verificar su estado',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put('emitir-voto-qr/dui/:dui/:candidato_id')
  async emitirVoto(
    @Param('dui') dui: string,
    @Param('candidato_id') candidato_id: string,
  ): Promise<Observable<IDestinoSufragio>> {
    
    const personaNaturalDui = await lastValueFrom(
      this._clientProxyPersonaNatural.send(PersonaNaturalMSG.FIND_BY_DUI, dui),
    );

    if (!personaNaturalDui)
      throw new HttpException(
        'Persona natural no encontrada',
        HttpStatus.NOT_FOUND,
      );

    const votantePoseeJRV = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.FIND_BY_PERSONA_NATURAL,
        { id_persona_natural: personaNaturalDui.id_persona_natural },
      ),
    );

    if (!votantePoseeJRV)
      throw new HttpException(
        'Votante no posee lugar de votacion',
        HttpStatus.NOT_FOUND,
      );

    if (votantePoseeJRV.jrv.estado == 'CERRADA')
      throw new HttpException('JRV CERRADA!!', HttpStatus.NOT_FOUND);

    if (votantePoseeJRV.jrv.centro_votacion.estado == 'CERRADA')
      throw new HttpException(
        'CENTRO DE VOTACION CERRADO!!',
        HttpStatus.NOT_FOUND,
      );

    if (votantePoseeJRV.ledger_id == null || votantePoseeJRV.uuid_info == null)
      throw new HttpException(
        'Votante no valido, regresar a paso #1',
        HttpStatus.NOT_FOUND,
      );

    const candidatoSeleccinado = await lastValueFrom(
      this._clientProxyCandidatos.send(CandidatosPoliticosMSG.FIND_ONE, 
        parseInt(candidato_id),
      ),
    );
    
    if (!candidatoSeleccinado)
      throw new HttpException(
        'No existe candidato seleccionado',
        HttpStatus.NOT_FOUND,
      );

    const verificarEstadoVoto = await lastValueFrom(
      this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.VERIFY_STATUS_VOTE,
        {
          ledger_id: votantePoseeJRV.ledger_id,
        },
      ),
    );

    let lastIndex = verificarEstadoVoto.length - 1;
    if (
      verificarEstadoVoto[lastIndex].data.estado === 1 &&
      verificarEstadoVoto[lastIndex].data.status === 1 &&
      verificarEstadoVoto[lastIndex].data.events.status === 1
    ) {
      return this._clientProxyDestinoSufragio.send(
        DestinoSufragioMSG.CAST_VOTE,
        {
          ledger_id: votantePoseeJRV.ledger_id,
          candidato_id: parseInt(candidato_id),
          id_detalle_sufragio: votantePoseeJRV.id_detalle_sufragio,
        },
      );
    } else {
      throw new HttpException(
        'Votante no valido, dirigirse a JRV para verificar su estado',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
