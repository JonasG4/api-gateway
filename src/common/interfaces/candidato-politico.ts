enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export interface ICandidatoPolitico {
  foto_candidato: string;
  estado?: Estado;
  id_partido_politico: number;
  id_persona_natural: number;
}
