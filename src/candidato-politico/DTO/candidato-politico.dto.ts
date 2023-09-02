import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class CandidatoPoliticoDTO {
  @ApiProperty({
    type: 'file',
  })
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
  @Transform(({ value }) => parseInt(value))
  id_partido_politico: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  id_persona_natural: number;
}

export class CandidatoPoliticoUpdateDTO {
  @ApiProperty({
    enum: Estado,
    required: false,
  })
  @IsEnum(Estado)
  @IsOptional()
  estado?: Estado;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  id_partido_politico?: number;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  id_persona_natural?: number;
}
