export interface IPartidoPolitico extends Document {
  nombre: string;
  siglas: string;
  logo: string;
  estado?: Estado;
}

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}
