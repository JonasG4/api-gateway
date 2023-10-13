export interface IJrvMiembro extends Document {
  id_jrv: number;
  id_usuario: number;
  estado?: Estado;
}

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}
