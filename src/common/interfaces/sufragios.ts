enum Genero {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
}

export interface ISufragio {
  genero: Genero;
  municipio: string;
  departamento: string;
  id_voto: number;
  codigo: string;
}
