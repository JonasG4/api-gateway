export interface IJuntaReceptoraVotos extends Document {
  id_centro_votacion: number;
  codigo: string;
  estado?: Estado;
}

enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}
