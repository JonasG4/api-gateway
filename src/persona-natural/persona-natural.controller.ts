import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { Observable, lastValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import {
  PersonaNaturalMSG,
} from 'src/common/constantes';
import { IPersonaNatural } from 'src/common/interfaces/persona-natural.js';
import { PersonaNaturalDTO } from './DTO/persona-natural.dto';

@ApiTags('persona natural')
@Controller('api/v1/persona-natural')
export class PersonaNaturalController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyPersonaNatural =
    this.clientProxy.clientProxyPersonaNatural();

  @Post()
create(
    @Body() personaNaturalDTO: PersonaNaturalDTO,
  ): Observable<IPersonaNatural> {
    
    return this._clientProxyPersonaNatural.send(
      PersonaNaturalMSG.CREATE,
      personaNaturalDTO,
    );
  }

  @Get()
  findAll(): Observable<IPersonaNatural[]> {
    return this._clientProxyPersonaNatural.send(
      PersonaNaturalMSG.FIND_ALL,
      '',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Observable<IPersonaNatural>> {
    // Se verifica que exista la junta receptora de votos
    const personaNatural = await lastValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_ONE,
        parseInt(id),
      ),
    );
    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!personaNatural) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return personaNatural;
  }

  @Get('dui/:dui')
  async findOneByDui(
    @Param('dui') dui: string,
  ): Promise<Observable<IPersonaNatural>> {
    // Se verifica que exista la junta receptora de votos
    const personaNaturalDui = await lastValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_BY_DUI,
        dui,
      ),
    );
    // Si no existe la junta receptora de votos, no se puede eliminar
    if (!personaNaturalDui) {
      throw new HttpException(
        'Junta Receptora de Votos no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return personaNaturalDui;
  }
}
