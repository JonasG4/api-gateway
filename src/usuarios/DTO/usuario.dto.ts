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
  @IsEmail()
  correo_electronico: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_rol: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  clave: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  estado: boolean;
}
