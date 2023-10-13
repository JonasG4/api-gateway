import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class JrvMiembroDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_jrv: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;
  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}
