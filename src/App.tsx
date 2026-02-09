import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import SettingsSidebar from "./components/ui/SettingsSidebar";
import { CarreraFindAllDTO } from "./types/CarreraFindAllDTO";
import { ComisionFindAllDTO } from "./types/ComisionFindAllDTO";
import { MateriaByComisionDTO } from "./types/MateriaByComisionDTO";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import DailySchedule from "./components/DailySchedule";
import WeeklySchedule from "./components/WeeklySchedule";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Label } from "./components/ui/label";
import { Clock, Plus, Search } from "lucide-react";
import { useCarreras } from "./hooks/useCarreras";
import { useComisiones } from "./hooks/useComisiones";
import { useCarreraMateriasFilteredByComision } from "./hooks/useCarreraMateriasFilteredByComision";
import { formatCompactSchedule, haySuperposicionHorarios } from "./lib/utils";
import { Badge } from "./components/ui/badge";

function App() {
  const [materiasSeleccionables, setMateriasSeleccionables] =
    useState<MateriaByComisionDTO[]>();
  const { carreras, fetchCarreras, loading } = useCarreras();
  const { comisiones, fetchComisiones } = useComisiones();
  const { carreraMaterias, fetchCarreraMaterias } =
    useCarreraMateriasFilteredByComision();

  const [selectedCarrera, setSelectedCarrera] = useState<CarreraFindAllDTO>();
  const [selectedComision, setSelectedComision] =
    useState<ComisionFindAllDTO>();
  const [selectedMaterias, setSelectedMaterias] =
    useState<MateriaByComisionDTO[]>();

  useEffect(() => {
    fetchCarreras();
  }, []);

  useEffect(() => {
    if (!carreraMaterias) return;
    setMateriasSeleccionables(carreraMaterias);
  }, [carreraMaterias]);

  const handleValueChangeCarrera = (carreraValue: string) => {
    const selectedCarreraId: number = Number(carreraValue);

    setSelectedCarrera(
      carreras?.filter((carrera) => carrera.id == selectedCarreraId)[0],
    );

    fetchComisiones(selectedCarreraId);
  };

  const handleValueChangeComision = (comisionValue: string) => {
    const selectedComisionNombre: string = comisionValue;
    console.log(selectedComisionNombre);
    setSelectedComision(
      comisiones?.filter(
        (comision) => comision.nombre == selectedComisionNombre,
      )[0],
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
        : [carreraMateria],
    );

    const materiasRestantes = materiasSeleccionables?.filter(
      (materia) => materia.materiaNombre != carreraMateria.materiaNombre,
    );
    setMateriasSeleccionables(materiasRestantes);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <SettingsSidebar
        selectedCarrera={selectedCarrera}
        setSelectedCarrera={setSelectedCarrera}
        selectedComision={selectedComision}
        setSelectedComision={setSelectedComision}
        selectedMaterias={selectedMaterias}
        setSelectedMaterias={setSelectedMaterias}
      />

      <main className="container mx-auto p-4 space-y-6 max-w-6xl">
        <Tabs defaultValue="semanal">
          <div className="flex justify-between mb-2 items-center">
            <TabsList>
              <TabsTrigger value="semanal">Semanal</TabsTrigger>
              <TabsTrigger value="diario">Diario</TabsTrigger>
            </TabsList>
            <Button size="lg" variant="secondary">
              Exportar como
            </Button>
          </div>

          <div className="flex flex-row gap-2 overflow-x-auto">
            <TabsContent value="semanal">
              <WeeklySchedule selectedMaterias={selectedMaterias} />
            </TabsContent>
            <TabsContent value="diario">
              <DailySchedule selectedMaterias={selectedMaterias} />
            </TabsContent>

            {/* <Card className="border-border rounded-none max-w-64">
              <CardHeader className="px-4">
                <CardTitle>Materias seleccionadas</CardTitle>
                <CardDescription>
                  Lista de materias seleccionadas mostradas en el calendario
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <SelectedMateriasList
                  selectedMaterias={selectedMaterias}
                  setSelectedMaterias={setSelectedMaterias}
                />
              </CardContent>
            </Card> */}

            <Card className="border-border rounded-none max-w-64 min-w-64 hidden lg:block">
              <CardHeader className="px-4">
                <CardTitle>Buscar materias</CardTitle>
                <CardDescription>
                  Busca materias para añadir al calendario
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4">
                <div className="space-y-6 py-4">
                  <div className="grid gap-3">
                    <Label>Carrera</Label>
                    <Select
                      name="selectedCarrera"
                      disabled={loading}
                      onValueChange={handleValueChangeCarrera}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        {carreras?.map((carrera) => (
                          <SelectItem
                            key={carrera.id}
                            value={String(carrera.id)}
                          >
                            {carrera.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-3">
                    <Label>Comisiones</Label>
                    <Select
                      name="selectedComision"
                      onValueChange={handleValueChangeComision}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una comisión" />
                      </SelectTrigger>
                      <SelectContent>
                        {comisiones?.map((comision) => (
                          <SelectItem
                            key={comision.id}
                            value={String(comision.nombre)}
                          >
                            {comision.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full flex flex-col">
                    <Button
                      variant="default"
                      disabled={!selectedCarrera || !selectedComision}
                      onClick={handleClickSearch}
                    >
                      <Search />
                      Buscar materias
                    </Button>
                  </div>
                </div>

                {materiasSeleccionables &&
                  materiasSeleccionables.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-md font-semibold leading-none">
                        Materias disponibles
                      </h3>
                      {materiasSeleccionables.map((carreraMateria) => (
                        <Card
                          key={carreraMateria.materiaNombre}
                          className="py-4 gap-0 border-border"
                        >
                          <CardHeader className="px-4">
                            <CardTitle className="flex gap-2 items-center">
                              <Badge variant="outline">
                                {carreraMateria.comisionNombre}
                              </Badge>
                              <span>{carreraMateria.materiaNombre}</span>
                            </CardTitle>
                            <CardAction>
                              <Button
                                onClick={() =>
                                  handleAddCarreraMateria(carreraMateria)
                                }
                                variant="default"
                                className="rounded-full"
                                size="icon-lg"
                              >
                                <Plus />
                              </Button>
                            </CardAction>
                          </CardHeader>
                          <CardContent className="px-4">
                            <div className="flex items-start gap-1 text-xs text-base-content/70">
                              <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="leading-tight whitespace-pre-line">
                                {formatCompactSchedule(carreraMateria.horarios)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

export default App;
