import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  Patch,
  HttpStatus,
  Delete,
  Put,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import {
  CandidatoPoliticoDTO,
  CandidatoPoliticoUpdateDTO,
} from './DTO/candidato-politico.dto';
import { fileValidators } from 'src/common/validators/file.validators';
import { ICandidatoPolitico } from 'src/common/interfaces/candidato-politico';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import {
  CandidatosPoliticosMSG,
  PartidosPoliticosMSG,
  PersonaNaturalMSG,
} from 'src/common/constantes';
import { Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Candidato Politico')
@Controller('api/v1/candidato-politico')
export class CandidatoPoliticoController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}

  private _clientProxyCandidatoPolitico =
    this.clientProxy.clientProxyCandidatosPoliticos();

  private _clientProxyPartidoPolitico =
    this.clientProxy.clientProxyPartidosPoliticos();

  private _clientProxyPersonaNatural =
    this.clientProxy.clientProxyPersonaNatural();

  @Roles(Role.Admin, Role.Root)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('foto_candidato'))
  async create(
    @Body() candidatoPoliticoDTO: CandidatoPoliticoDTO,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: fileValidators.foto_candidato,
      }),
    )
    foto_candidato: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    const existPartidoPolitico = await firstValueFrom(
      this._clientProxyPartidoPolitico.send(
        PartidosPoliticosMSG.FIND_ONE,
        Number(candidatoPoliticoDTO.id_partido_politico),
      ),
    );

    const existPersonaNatural = await firstValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_ONE,
        Number(candidatoPoliticoDTO.id_persona_natural),
      ),
    );

    if (!existPartidoPolitico) {
      throw new HttpException(
        'Partido Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!existPersonaNatural) {
      throw new HttpException(
        'Persona Natural no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    this._clientProxyCandidatoPolitico
      .send(CandidatosPoliticosMSG.CREATE, {
        candidatoPolitico: candidatoPoliticoDTO,
        foto_candidato,
      })
      .subscribe((response: ICandidatoPolitico | Record<string, any>) => {
        if ('statusCode' in response) {
          return res.status(response.statusCode).json(response);
        } else {
          return res.status(HttpStatus.CREATED).json(response);
        }
      });
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente, Role.Secretario, Role.Vocal)
  @Get()
  findAll(): Observable<ICandidatoPolitico[]> {
    return this._clientProxyCandidatoPolitico.send(
      CandidatosPoliticosMSG.FIND_ALL,
      '',
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente, Role.Secretario, Role.Vocal)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Observable<ICandidatoPolitico>> {
    const candidatoPolitico = await lastValueFrom(
      this._clientProxyCandidatoPolitico.send(
        CandidatosPoliticosMSG.FIND_ONE,
        parseInt(id),
      ),
    );
    if (!candidatoPolitico) {
      throw new HttpException(
        'Candidato Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
    return candidatoPolitico;
  }

  @Roles(Role.Admin, Role.Root)
  @Put(':id')
  async update(
    @Body() candidatoPoliticoDTO: CandidatoPoliticoUpdateDTO,
    @Param('id') id: string,
  ): Promise<Observable<ICandidatoPolitico>> {
    const candidatoPolitico = await lastValueFrom(
      this._clientProxyCandidatoPolitico.send(
        CandidatosPoliticosMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    if (!candidatoPolitico) {
      throw new HttpException(
        'Candidato Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const existPartidoPolitico = await firstValueFrom(
      this._clientProxyPartidoPolitico.send(
        PartidosPoliticosMSG.FIND_ONE,
        Number(candidatoPoliticoDTO.id_partido_politico),
      ),
    );

    const existPersonaNatural = await firstValueFrom(
      this._clientProxyPersonaNatural.send(
        PersonaNaturalMSG.FIND_ONE,
        Number(candidatoPoliticoDTO.id_persona_natural),
      ),
    );

    if (!existPartidoPolitico) {
      throw new HttpException(
        'Partido Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!existPersonaNatural) {
      throw new HttpException(
        'Persona Natural no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyCandidatoPolitico.send(
      CandidatosPoliticosMSG.UPDATE,
      {
        id: parseInt(id),
        candidatoPoliticoDTO,
      },
    );
  }

  @Roles(Role.Admin, Role.Root)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Observable<any>> {
    const candidatoPolitico = await lastValueFrom(
      this._clientProxyCandidatoPolitico.send(
        CandidatosPoliticosMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    if (!candidatoPolitico) {
      throw new HttpException(
        'Candidato Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyCandidatoPolitico.send(
      CandidatosPoliticosMSG.DELETE,
      parseInt(id),
    );
  }

  @Roles(Role.Admin, Role.Root)
  @Patch(':id/cambiar-foto')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        foto_candidato: {
          type: 'file',
          format: 'jpg|jpeg|png',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('foto_candidato'))
  async cambiarFoto(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: fileValidators.foto_candidato,
      }),
    )
    nuevaFoto: Express.Multer.File,
  ): Promise<Observable<any>> {
    const candidatoPolitico = await lastValueFrom(
      this._clientProxyCandidatoPolitico.send(
        CandidatosPoliticosMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    if (!candidatoPolitico) {
      throw new HttpException(
        'Candidato Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyCandidatoPolitico.send(
      CandidatosPoliticosMSG.CHANGE_PHOTO,
      {
        id: parseInt(id),
        nuevaFoto,
      },
    );
  }
}
