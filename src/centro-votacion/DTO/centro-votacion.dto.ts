import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum Estado {
  ABIERTA = 'ABIERTA',
  CERRADA = 'CERRADA',
}

export class EstadoDTO {
  @IsEnum(Estado)
  @IsNotEmpty()
  estado: Estado;
}

export class CentroVotacionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id_municipio: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  direccion: string;
  @ApiProperty({
    enum: Estado,
    required: false,
  })
  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}
