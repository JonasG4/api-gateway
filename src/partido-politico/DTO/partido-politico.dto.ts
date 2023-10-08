import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class PartidoPoliticoDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  siglas: string;
  @ApiProperty({
    type: 'file',
  })
  logo: string;
  @ApiProperty({
    enum: Estado,
    required: false,
  })
  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}
