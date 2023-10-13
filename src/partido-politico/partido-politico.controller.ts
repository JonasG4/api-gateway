import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PartidosPoliticosMSG } from 'src/common/constantes';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { PartidoPoliticoDTO } from './DTO/partido-politico.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { IPartidoPolitico } from 'src/common/interfaces/partido-politico';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidators } from 'src/common/validators/file.validators';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Partido Politico')
@Controller('api/v1/partido-politico')
export class PartidoPoliticoController {
  constructor(private readonly clientProxy: ClientProxyAppAdminitracion) {}
  private _clientProxyPartidoPolitico =
    this.clientProxy.clientProxyPartidosPoliticos();

  @Roles(Role.Root)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() partidoPoliticoDTO: PartidoPoliticoDTO,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: fileValidators.logo,
      }),
    )
    logo: Express.Multer.File,
  ): Observable<IPartidoPolitico> {
    return this._clientProxyPartidoPolitico.send(PartidosPoliticosMSG.CREATE, {
      PartidoPolitico: partidoPoliticoDTO,
      logo,
    });
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente, Role.Secretario, Role.Vocal)
  @Get()
  findAll(): Observable<IPartidoPolitico[]> {
    return this._clientProxyPartidoPolitico.send(
      PartidosPoliticosMSG.FIND_ALL,
      '',
    );
  }

  @Roles(Role.Admin, Role.Root, Role.Presidente, Role.Secretario, Role.Vocal)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<Observable<IPartidoPolitico>> {
    // Se verifica que exista el partido politico
    const partidoPolitico = await lastValueFrom(
      this._clientProxyPartidoPolitico.send(
        PartidosPoliticosMSG.FIND_ONE,
        parseInt(id),
      ),
    );
    // Si no existe el partido politico, no se puede eliminar
    if (!partidoPolitico) {
      throw new HttpException(
        'Partido Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return partidoPolitico;
  }

  @Roles(Role.Root)
  @Put(':id')
  async update(
    @Body() partidoPoliticoDTO: PartidoPoliticoDTO,
    @Param('id') id: string,
  ): Promise<Observable<IPartidoPolitico>> {
    const partidoPolitico = await lastValueFrom(
      this._clientProxyPartidoPolitico.send(
        PartidosPoliticosMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    // Si no existe el partido politico, no se puede eliminar
    if (!partidoPolitico) {
      throw new HttpException(
        'Partido Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyPartidoPolitico.send(PartidosPoliticosMSG.UPDATE, {
      id: parseInt(id),
      partidoPoliticoDTO,
    });
  }

  @Roles(Role.Root)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Observable<any>> {
    // Se verifica que exista el partido politico
    const partidoPolitico = await lastValueFrom(
      this._clientProxyPartidoPolitico.send(
        PartidosPoliticosMSG.FIND_ONE,
        parseInt(id),
      ),
    );

    // Si no existe el partido politico, no se puede eliminar
    if (!partidoPolitico) {
      throw new HttpException(
        'Partido Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyPartidoPolitico.send(
      PartidosPoliticosMSG.DELETE,
      parseInt(id),
    );
  }

  @Roles(Role.Root)
  @Patch(':idPartidoPolitico/cambiar-logo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'file',
          format: 'jpg|jpeg|png',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('logo'))
  async changeLogo(
    @Param('idPartidoPolitico') idPartidoPolitico: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: fileValidators.logo,
      }),
    )
    newLogo: Express.Multer.File,
  ): Promise<Observable<any>> {
    // Se verifica que exista el partido politico
    const partidoPolitico = await lastValueFrom(
      this._clientProxyPartidoPolitico.send(
        PartidosPoliticosMSG.FIND_ONE,
        parseInt(idPartidoPolitico),
      ),
    );
    // Si no existe el partido politico, no se puede eliminar
    if (!partidoPolitico) {
      throw new HttpException(
        'Partido Politico no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return this._clientProxyPartidoPolitico.send(
      PartidosPoliticosMSG.CHANGE_LOGO,
      {
        id: parseInt(idPartidoPolitico),
        newLogo,
      },
    );
  }
}
