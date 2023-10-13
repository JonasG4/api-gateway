import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthDTO{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    usuario: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    clave: string
}