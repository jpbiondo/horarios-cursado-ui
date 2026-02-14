import { MateriaByComisionDTO } from "./MateriaByComisionDTO";

export interface Profile {
  id: string;
  name: string;
  materias: MateriaByComisionDTO[];
  createdAt: number;
}
