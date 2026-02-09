import { useState } from "react";
import Footer from "./components/Footer";
import SettingsSidebar from "./components/ui/SettingsSidebar";
import BuscarMaterias from "./components/BuscarMaterias";
import { MateriaByComisionDTO } from "./types/MateriaByComisionDTO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import DailySchedule from "./components/DailySchedule";
import WeeklySchedule from "./components/WeeklySchedule";
import { Button } from "./components/ui/button";

function App() {
  const [selectedMaterias, setSelectedMaterias] =
    useState<MateriaByComisionDTO[]>();

  return (
    <div className="min-h-screen bg-base-200">
      <SettingsSidebar
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

            <BuscarMaterias
              variant="card"
              selectedMaterias={selectedMaterias}
              setSelectedMaterias={setSelectedMaterias}
            />
          </div>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

export default App;
