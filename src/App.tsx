import { useState } from "react";
import Footer from "./components/Footer";
import Schedule from "./components/Schedule";
import SettingsSidebar from "./components/ui/SettingsSidebar";
import { CarreraFindAllDTO } from "./types/CarreraFindAllDTO";
import { ComisionFindAllDTO } from "./types/ComisionFindAllDTO";
import SelectedMateriasList from "./components/SelectedMateriasList";
import { MateriaByComisionDTO } from "./types/MateriaByComisionDTO";

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

      <main className="container mx-auto p-4 space-y-6">
        <Schedule selectedMaterias={selectedMaterias} />

        {
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <SelectedMateriasList
                selectedMaterias={selectedMaterias}
                setSelectedMaterias={setSelectedMaterias}
              />
            </div>
          </div>
        }
      </main>

      <Footer />
    </div>
  );
}

export default App;
