import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
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
