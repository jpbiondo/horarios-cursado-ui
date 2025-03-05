import { Calendar } from "lucide-react";
import { useState } from "react";
import WeeklySchedule from "./WeeklySchedule";
import DailySchedule from "./DailySchedule";

export default function Schedule() {
  const [view, setView] = useState<"daily" | "weekly">("weekly");

  const handleWeeklyView = () => {
    setView("weekly");
  };

  const handleDailyView = () => {
    setView("daily");
  };

  return (
    <section className="mt-8">
      <div className="flex flex-row gap-2 items-center justify-center mb-8">
        <Calendar className="h-8 w-8" />
        <h2 className="text-4xl font-bold text-center">Calendario semanal</h2>
      </div>

      {/* name of each tab group should be unique */}
      <div className="max-w-sm mb-8 mx-auto">
        <div className="tabs tabs-box">
          <input
            type="radio"
            name="scheduler_type_tabs"
            className="tab flex-1"
            aria-label="Diario"
            onClick={handleDailyView}
          />
          <input
            type="radio"
            name="scheduler_type_tabs"
            className="tab flex-1"
            aria-label="Semanal"
            onClick={handleWeeklyView}
            defaultChecked
          />
        </div>
      </div>

      <div className="px-8">
        {view === "weekly" ? <WeeklySchedule /> : <DailySchedule />}
      </div>
    </section>
  );
}
