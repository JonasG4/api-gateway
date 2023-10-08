import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../constantes';

export const Roles = (...roles: Role[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
