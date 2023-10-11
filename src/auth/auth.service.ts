import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosMSG } from 'src/common/constantes';
import { ClientProxyAppAdminitracion } from 'src/common/proxy/client-proxy';
import { lastValueFrom } from 'rxjs';
import { UsuarioDTO } from 'src/usuarios/DTO/usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxyAppAdminitracion,
    private readonly jwtService: JwtService,
  ) {}

  private _clientProxyUsuario = this.clientProxy.clientProxyUsuarios();

  async validateUser(username: string, password: string): Promise<any> {
    const user = await lastValueFrom(
      this._clientProxyUsuario.send(UsuariosMSG.VALIDATE_USER, {
        usuario: username,
        clave: password,
      }),
    );

    if (!user) return null;

    return user;
  }

  async signIn(user: any) {
    const payload = {
      username: user.usuario,
      id: user.id_usuario,
      rol: user.Rol.nombre,
      nombres: user.nombres,
      apellidos: user.apellidos,
      dui: user.dui,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(usuarioDTO: UsuarioDTO) {
    return await lastValueFrom(
      this._clientProxyUsuario.send(UsuariosMSG.CREATE, usuarioDTO),
    );
  }
}
