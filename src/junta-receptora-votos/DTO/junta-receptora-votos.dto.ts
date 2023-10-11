import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class JuntaReceptoraVotosDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  codigo: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_centro_votacion: number;
  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}
