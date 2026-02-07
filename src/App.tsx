import { useState } from "react";
import Footer from "./components/Footer";
import SettingsSidebar from "./components/ui/SettingsSidebar";
import { CarreraFindAllDTO } from "./types/CarreraFindAllDTO";
import { ComisionFindAllDTO } from "./types/ComisionFindAllDTO";
import SelectedMateriasList from "./components/SelectedMateriasList";
import { MateriaByComisionDTO } from "./types/MateriaByComisionDTO";
import {
  Card,
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
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Label } from "./components/ui/label";
import { Search } from "lucide-react";

function App() {
  const [selectedCarrera, setSelectedCarrera] = useState<CarreraFindAllDTO>();
  const [selectedComision, setSelectedComision] =
    useState<ComisionFindAllDTO>();
  const [selectedMaterias, setSelectedMaterias] =
    useState<MateriaByComisionDTO[]>();

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
            {/* <TabsList>
              <TabsTrigger value="semanal">Semanal</TabsTrigger>
              <TabsTrigger value="diario">Diario</TabsTrigger>
            </TabsList> */}
            <Button size="lg" variant="secondary">
              Exportar como
            </Button>
          </div>

          <div className="flex flex-row gap-2">
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
                    <Select name="selectedCarrera">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una carrera" />
                      </SelectTrigger>
                    </Select>
                  </div>

                  <div className="grid gap-3">
                    <Label>Comisiones</Label>
                    <Select name="selectedComision">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una comisión" />
                      </SelectTrigger>
                      <SelectContent></SelectContent>
                    </Select>
                  </div>
                  <div className="w-full flex flex-col">
                    <Button
                      variant="default"
                      disabled={!selectedCarrera || !selectedComision}
                    >
                      <Search />
                      Buscar materias
                    </Button>
                  </div>
                </div>
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
