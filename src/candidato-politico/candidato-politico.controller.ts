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
import { Observable, lastValueFrom } from 'rxjs';
import { CandidatosPoliticosMSG } from 'src/common/constantes';

@ApiTags('Candidato Politico')
@Controller('api/v1/candidato-politico')
export class CandidatoPoliticoController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}

  private _clientProxyCandidatoPolitico =
    this.clientProxy.clientProxyCandidatosPoliticos();

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('foto_candidato'))
  create(
    @Body() candidatoPoliticoDTO: CandidatoPoliticoDTO,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: fileValidators.foto_candidato,
      }),
    )
    foto_candidato: Express.Multer.File,
  ): Observable<ICandidatoPolitico> {
    return this._clientProxyCandidatoPolitico.send(
      CandidatosPoliticosMSG.CREATE,
      {
        candidatoPolitico: candidatoPoliticoDTO,
        foto_candidato,
      },
    );
  }

  @Get()
  findAll(): Observable<ICandidatoPolitico[]> {
    return this._clientProxyCandidatoPolitico.send(
      CandidatosPoliticosMSG.FIND_ALL,
      '',
    );
  }

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

    return this._clientProxyCandidatoPolitico.send(
      CandidatosPoliticosMSG.UPDATE,
      {
        id: parseInt(id),
        candidatoPoliticoDTO,
      },
    );
  }

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
      nuevaFoto,
    );
  }
}
