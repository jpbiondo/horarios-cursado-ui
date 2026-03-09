import { Profesor } from "./Profesor";

export interface Consulta {
  profesor: Profesor;
  materia: string;
  dia: string;
  horaDesde: string;
  horaHasta?: string;
  nota: string;
  zoomUrl: string;
}
