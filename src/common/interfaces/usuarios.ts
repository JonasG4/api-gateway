export interface IUsuario extends Document {
  usuario: string;
  correo_electronico: string;
  clave: string;
  id_rol: number;
  estado: boolean;
}
