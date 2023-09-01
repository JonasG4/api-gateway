export interface ICentroVotacion extends Document {
  id_municipio: number;
  nombre: string;
  direccion: string;
  estado?: Estado;
}
enum Estado {
  ABIERTA = 'ABIERTA',
  CERRADA = 'CERRADA',
}
