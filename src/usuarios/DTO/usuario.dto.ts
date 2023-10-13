import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UsuarioDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  usuario: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombres: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_rol: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apellidos: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dui: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  clave: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  estado: boolean;
}
export class UsuarioUpdateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  usuario: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombres: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id_rol: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apellidos: string;
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @IsString()
  dui: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  estado: boolean;
}
