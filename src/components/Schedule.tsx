import { useState } from "react";
import WeeklySchedule from "./WeeklySchedule";
import DailySchedule from "./DailySchedule";
import ScheduleHeader from "./ScheduleHeader";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";

interface ScheduleProps {
  selectedMaterias?: MateriaByComisionDTO[];
}
export default function Schedule({ selectedMaterias }: ScheduleProps) {
  const [scheduleView, toggleView] = useState<"weekly" | "daily">("weekly");

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <ScheduleHeader
          scheduleView={scheduleView}
          toggleView={(view) => toggleView(view as "weekly" | "daily")}
        />
        <div className="mt-4">
          {scheduleView === "weekly" ? (
            <WeeklySchedule selectedMaterias={selectedMaterias} />
          ) : (
            <DailySchedule selectedMaterias={selectedMaterias} />
          )}
        </div>
      </div>
    </div>
  );
}
