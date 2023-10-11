export interface IUsuario extends Document {
  usuario: string;
  nombres: string;
  apellidos: string;
  clave: string;
  id_rol: number;
  dui: string;
  estado: boolean;
}
