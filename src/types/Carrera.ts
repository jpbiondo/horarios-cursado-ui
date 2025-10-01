import { Comision } from "./Comision";
import { Materia } from "./Materia";

export interface Carrera {
  nombre: string;
  materias: CarreraMateria[];
}

export interface CarreraMateria {
  materia: Materia;
  comisiones: CarreraMateriaComision[];
}

interface CarreraMateriaComision {
  comision: Comision;
  horarios: CarreraMateriaComisionHorario[];
}

export interface CarreraMateriaComisionHorario {
  dia: string;
  horaDesde: string;
  horaHasta: string;
}
