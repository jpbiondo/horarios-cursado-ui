import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface DailyScheduleProps {
  scheduleView: string;
  toggleView: (view: string) => void;
}
export default function ScheduleHeader({ toggleView }: DailyScheduleProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-row gap-3 items-center">
        <Calendar className="text-primary w-8 h-8" />
        <div>
          <h1 className="text-2xl font-bold text-base-content">Horarios</h1>
          <p className="text-base-content/70 text-sm">
            {format(new Date(), "MMMM dd, yyyy")}
          </p>
        </div>
      </div>

      <div className="tabs tabs-boxed bg-base-200">
        <input
          type="radio"
          name="scheduler_type_tabs"
          className="tab"
          aria-label="Diario"
          onClick={() => toggleView("daily")}
        />
        <input
          type="radio"
          name="scheduler_type_tabs"
          className="tab"
          aria-label="Semanal"
          onClick={() => toggleView("weekly")}
          defaultChecked
        />
      </div>
    </div>
  );
}
