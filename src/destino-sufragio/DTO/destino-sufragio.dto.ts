import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DestinoSufragioDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_persona_natural: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_jrv: number;
}
