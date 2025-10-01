import { Plus, Search, Settings, Clock } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useCarreras } from "../../hooks/useCarreras";
import { useComisiones } from "../../hooks/useComisiones";
import { CarreraFindAllDTO } from "../../types/CarreraFindAllDTO";
import { useCarreraMateriasFilteredByComision } from "../../hooks/useCarreraMateriasFilteredByComision";
import { ComisionFindAllDTO } from "../../types/ComisionFindAllDTO";
import {
  haySuperposicionHorarios,
  formatCompactSchedule,
} from "../../lib/utils";
import { MateriaByComisionDTO } from "../../types/MateriaByComisionDTO";

interface SettingsSidebarProps {
  selectedCarrera?: CarreraFindAllDTO;
  setSelectedCarrera: React.Dispatch<
    React.SetStateAction<CarreraFindAllDTO | undefined>
  >;

  selectedComision?: ComisionFindAllDTO;
  setSelectedComision: React.Dispatch<
    React.SetStateAction<ComisionFindAllDTO | undefined>
  >;

  selectedMaterias?: MateriaByComisionDTO[];
  setSelectedMaterias: React.Dispatch<
    React.SetStateAction<MateriaByComisionDTO[] | undefined>
  >;
}
export default function SettingsSidebar({
  selectedCarrera,
  setSelectedCarrera,
  selectedComision,
  setSelectedComision,
  selectedMaterias,
  setSelectedMaterias,
}: SettingsSidebarProps) {
  const [materiasSeleccionables, setMateriasSeleccionables] =
    useState<MateriaByComisionDTO[]>();

  const { carreras, fetchCarreras, loading } = useCarreras();
  const { comisiones, fetchComisiones } = useComisiones();
  const { carreraMaterias, fetchCarreraMaterias } =
    useCarreraMateriasFilteredByComision();

  useEffect(() => {
    fetchCarreras();
  }, []);

  useEffect(() => {
    if (!carreraMaterias) return;
    setMateriasSeleccionables(carreraMaterias);
  }, [carreraMaterias]);

  const handleChangeCarrera = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value == "default") return;

    const selectedCarreraId: number = Number(event.target.value);
    setSelectedCarrera(
      carreras?.filter((carrera) => carrera.id == selectedCarreraId)[0]
    );
    fetchComisiones(selectedCarrera?.id);
  };

  const handleChangeComision = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value == "default") return;

    const selectedComisionNombre: string = event.target.value;
    setSelectedComision(
      comisiones?.filter(
        (comision) => comision.nombre == selectedComisionNombre
      )[0]
    );
  };

  const handleClickSearch = () => {
    if (!selectedComision) return;
    fetchCarreraMaterias(selectedComision.nombre);
  };

  const handleAddCarreraMateria = (carreraMateria: MateriaByComisionDTO) => {
    if (
      selectedMaterias &&
      selectedMaterias?.length > 0 &&
      haySuperposicionHorarios(carreraMateria, selectedMaterias)
    ) {
      console.log("HAY SUPERPOSICION BOLUDO");
    }

    setSelectedMaterias(
      selectedMaterias
        ? [...selectedMaterias, carreraMateria]
        : [carreraMateria]
    );

    const materiasRestantes = materiasSeleccionables?.filter(
      (materia) => materia.materiaNombre != carreraMateria.materiaNombre
    );
    setMateriasSeleccionables(materiasRestantes);
    console.log(selectedMaterias);
  };
  return (
    <div className="drawer drawer-start z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer"
          className="btn btn-circle btn-primary drawer-button fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-1"
        >
          <Settings className="w-8 h-8" />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-100 text-base-content min-h-full w-80 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-base-content mb-2">
              Buscar materias
            </h2>
            <p className="text-base-content/70 text-sm">
              Selecciona tu carrera y comisión para ver las materias disponibles
            </p>
          </div>
          <div className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Carrera</span>
              </label>
              <select
                name="selectedCarrera"
                defaultValue="default"
                onChange={handleChangeCarrera}
                className="select select-bordered w-full"
                disabled={loading}
              >
                <option value="default">Seleccione una carrera</option>
                {!loading &&
                  carreras?.map((carrera) => (
                    <option key={carrera.id} value={carrera.id}>
                      {carrera.nombre}
                    </option>
                  ))}
              </select>
              {loading && (
                <span className="loading loading-spinner loading-sm mt-2"></span>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Comisión</span>
              </label>
              <select
                name="selectedComision"
                onChange={handleChangeComision}
                defaultValue="default"
                className="select select-bordered w-full"
                disabled={!selectedCarrera}
              >
                <option value="default">Seleccione una comisión</option>
                {comisiones?.map((comision) => (
                  <option key={comision.id} value={comision.nombre}>
                    {comision.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-primary w-full gap-2"
              disabled={!selectedCarrera || !selectedComision}
              onClick={handleClickSearch}
            >
              <Search className="w-4 h-4" />
              Buscar materias
            </button>
            {materiasSeleccionables && materiasSeleccionables.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-base-content/80">
                  Materias disponibles:
                </h3>
                {materiasSeleccionables.map((carreraMateria) => (
                  <div
                    key={carreraMateria.materiaNombre}
                    className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="mb-2">
                            <h3 className="font-semibold text-sm text-base-content leading-tight">
                              <span className="badge badge-outline badge-xs mr-1">
                                {carreraMateria.comisionNombre}
                              </span>
                              {carreraMateria.materiaNombre}
                            </h3>
                          </div>
                          <div className="flex items-start gap-1 text-xs text-base-content/70">
                            <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="leading-tight whitespace-pre-line">
                              {formatCompactSchedule(carreraMateria.horarios)}
                            </span>
                          </div>
                        </div>
                        <button
                          className="btn btn-primary btn-sm btn-circle"
                          onClick={() =>
                            handleAddCarreraMateria(carreraMateria)
                          }
                          title="Agregar materia"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
