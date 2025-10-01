import { CarreraMateriaComisionHorario } from "./Carrera";

export interface MateriaByComisionDTO {
  comisionNombre: string;
  materiaNombre: string;
  horarios: CarreraMateriaComisionHorario[];
}
