import { Calendar } from "lucide-react";
import { useState } from "react";
import WeeklySchedule from "./WeeklySchedule";
import { format } from "date-fns";
import { useToggleState } from "../hooks/useToggleState";
import DailySchedule from "./DailySchedule";

export default function Schedule() {
  const [scheduleView, toggleView] = useState(true);

  return (
    <section className="mt-8 px-8 w-full max-w-7xl">
      <div className="px-8 max-w-7xl mx-auto card bg-base-100 py-8">
        <div className="flex flex-row justify-between mb-8">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Calendar />
            <h2 className="text-2xl font-semibold text-center">
              Calendario semanal
            </h2>
          </div>

          <div>
            <span className="text-xl">
              {format(new Date(), "MMMM dd, yyyy")}
            </span>
          </div>
          {/* name of each tab group should be unique */}
          <div className=" max-w-md font-medium">
            <div className="tabs tabs-box">
              <input
                type="radio"
                name="scheduler_type_tabs"
                className="tab flex-1"
                aria-label="Diario"
                onClick={() => toggleView(false)}
              />
              <input
                type="radio"
                name="scheduler_type_tabs"
                className="tab flex-1"
                aria-label="Semanal"
                onClick={() => toggleView(true)}
                defaultChecked
              />
            </div>
          </div>
        </div>
        <div>{scheduleView ? <WeeklySchedule /> : <DailySchedule />}</div>
      </div>
    </section>
  );
}
