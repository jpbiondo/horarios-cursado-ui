import { useState } from "react";
import WeeklySchedule from "./WeeklySchedule";
import DailySchedule from "./DailySchedule";
import ScheduleHeader from "./ScheduleHeader";

export default function Schedule() {
  const [scheduleView, toggleView] = useState<"weekly" | "daily">("weekly");

  return (
    <section className="mt-4 px-8 w-full max-w-7xl">
      <div className="px-8 max-w-7xl mx-auto py-4">
        <ScheduleHeader
          scheduleView={scheduleView}
          toggleView={(view) => toggleView(view as "weekly" | "daily")}
        />
        <div>
          {scheduleView === "weekly" ? <WeeklySchedule /> : <DailySchedule />}
        </div>
      </div>
    </section>
  );
}
