import WeeklySchedule from "./WeeklySchedule";
import DailySchedule from "./DailySchedule";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ScheduleProps {
  selectedMaterias?: MateriaByComisionDTO[];
}
export default function Schedule({ selectedMaterias }: ScheduleProps) {
  return (
    <div>
      <Tabs defaultValue="semanal">
        <div className="flex justify-between mb-2">
          <div className="flex flex-row gap-2 items-center">
            <Calendar className="w-8 h-8" />
            <p className="text-xl">{format(new Date(), "MMMM dd, yyyy")}</p>
          </div>
          <TabsList>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="diario">Diario</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="semanal">
          <WeeklySchedule selectedMaterias={selectedMaterias} />
        </TabsContent>
        <TabsContent value="diario">
          <DailySchedule selectedMaterias={selectedMaterias} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
