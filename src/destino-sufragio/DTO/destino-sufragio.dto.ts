import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

enum EstadoVoto {
  SIN_EMITIR = 'SIN_EMITIR',
  EMITIDO = 'EMITIDO',
}
export class DestinoSufragioDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_personas_natural: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_jrv: number;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  supervisado_por?: number;
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  asistio_en?: Date;
  @IsOptional()
  @IsEnum(EstadoVoto)
  estado_voto?: EstadoVoto;
}

export class estadoVoto{
  SIN_EMITIR = 'SIN_EMITIR'
  EMITIDO = 'EMITIDO'
}