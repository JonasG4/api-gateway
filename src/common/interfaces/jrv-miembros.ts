export interface IJrvMiembros extends Document {
  id_jrv: number;
  id_persona_natural: number;
  id_usuario: number;
  estado?: Estado;
}

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}
