import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/role.enum';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/common/constantes';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (!token) return false;

    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    req['usuario'] = payload;

    const isRoleAuth = requiredRoles.some(
      (role) => req.usuario.rol?.includes(role),
    );

    if (!isRoleAuth)
      throw new UnauthorizedException(
        'No tienes permisos necesarios para acceder',
      );

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
