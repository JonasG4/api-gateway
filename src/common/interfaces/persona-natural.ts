enum Genero {
    MASCULINO = 'MASCULINO',
    FEMENINO = 'FEMENINO',
  }
  
export interface IPersonaNatural extends Document{
    dui: string;
    nombres: string;
    apellidos: string;
    genero: Genero;
    id_municipio: number;
    detalle_direccion: string;
    fecha_nacimiento: Date;
    fecha_vencimiento_dui: Date;
  }
  