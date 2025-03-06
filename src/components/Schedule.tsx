import { Calendar } from "lucide-react";
import { useRef, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import { CalendarApi } from "@fullcalendar/core/index.js";
import WeeklySchedule from "./WeeklySchedule";
import { format } from "date-fns";

export default function Schedule() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const changeView = (viewName: string) => {
    if (!calendarRef.current) return;

    const calendarApi: CalendarApi = calendarRef.current.getApi();

    if (calendarApi) {
      calendarApi.changeView(viewName);
    }
  };

  return (
    <section className="mt-8 px-8 w-full max-w-7xl">
      <div className="px-8 max-w-7xl mx-auto card bg-base-100 py-8">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center justify-center mb-8">
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
                onClick={() => changeView("timeGridDay")}
              />
              <input
                type="radio"
                name="scheduler_type_tabs"
                className="tab flex-1"
                aria-label="Semanal"
                onClick={() => changeView("timeGridWeek")}
                defaultChecked
              />
            </div>
          </div>
        </div>

        <WeeklySchedule />
      </div>
    </section>
  );
}
