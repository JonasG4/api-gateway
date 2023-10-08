import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    ('????');
    return {
      username: payload.usuario,
      id: payload.id_usuario,
      rol: payload.Rol.nombre,
      nombres: payload.PersonaNatural.nombres,
      apellidos: payload.PersonaNatural.apellidos,
      dui: payload.PersonaNatural.dui,
      genero: payload.PersonaNatural.genero,
    };
  }
}
