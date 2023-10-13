import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

enum Genero {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
}

export class PersonaNaturalDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(10)
  dui: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombres: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  apellidos: string;
  @ApiProperty({
    enum: Genero,
  })
  @IsOptional()
  @IsEnum(Genero)
  genero: Genero;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_municipio: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  detalle_direccion: string;
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fecha_nacimiento: Date;
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fecha_vencimiento_dui: Date;
}

export class PersonaNaturalFilter {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  municipio?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  departamento?: string;

  @ApiProperty({
    enum: Genero,
    required: false,
  })
  @IsEnum(Genero)
  @IsOptional()
  genero?: Genero;
}
