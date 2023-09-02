import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class JuntaReceptoraVotosDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  codigo: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_centro_votacion: number;
  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}
