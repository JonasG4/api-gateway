import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class CandidatoPoliticoDTO {
  @ApiProperty({
    type: 'file',
  })
  @IsNotEmpty()
  @IsString()
  foto_candidato: string;

  @ApiProperty({
    enum: Estado,
    required: false,
  })
  @IsEnum(Estado)
  @IsOptional()
  estado?: Estado;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_partido_politico: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_persona_natural: number;
}
