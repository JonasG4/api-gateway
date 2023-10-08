export interface IDestinoSufragio extends Document {
  id_personas_natural: number;
  id_jrv: number;
  supervisado_por?: number;
  asistio_en?: Date;
  estado_voto?: EstadoVoto;
}

enum EstadoVoto {
  SIN_EMITIR = 'SIN_EMITIR',
  EMITIDO = 'EMITIDO',
}
