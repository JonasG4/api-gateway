import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { Observable, lastValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';
import { PersonaNaturalMSG } from 'src/common/constantes';
import { IPersonaNatural } from 'src/common/interfaces/persona-natural.js';
import {
  PersonaNaturalDTO,
  PersonaNaturalFilter,
} from './DTO/persona-natural.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('persona natural')
@Controller('api/v1/persona-natural')
export class PersonaNaturalController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyPersonaNatural =
    this.clientProxy.clientProxyPersonaNatural();

  @Roles(Role.Root, Role.Admin)
  @Post()
  async create(
    @Body() personaNaturalDTO: PersonaNaturalDTO,
  ): Promise<Observable<IPersonaNatural>> {
    const isDuiExist = await lastValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_BY_DUI,
        personaNaturalDTO.dui,
      ),
    );

    if (isDuiExist)
      throw new HttpException(
        'El dui ya fue registrado',
        HttpStatus.BAD_REQUEST,
      );

    return this._clientProxyPersonaNatural.send(
      PersonaNaturalMSG.CREATE,
      personaNaturalDTO,
    );
  }

  @Get()
  findAll(
    @Query() filters: PersonaNaturalFilter,
  ): Observable<IPersonaNatural[]> {
    return this._clientProxyPersonaNatural.send(
      PersonaNaturalMSG.FIND_ALL,
      filters,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Observable<IPersonaNatural>> {
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
  async findByDui(@Param('dui') dui: string) {
    const persona_natural = await lastValueFrom(
      this._clientProxyPersonaNatural.send(PersonaNaturalMSG.FIND_BY_DUI, dui),
    );

    if (!persona_natural)
      throw new HttpException(
        'No se encontró ningún usuario',
        HttpStatus.NOT_FOUND,
      );

    return persona_natural;
  }
}
