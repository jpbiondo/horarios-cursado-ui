import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface DailyScheduleProps {
  scheduleView: string;
  toggleView: (view: string) => void;
}
export default function ScheduleHeader({ toggleView }: DailyScheduleProps) {
  return (
    <div className="flex flex-row justify-between mb-4">
      <div className="flex flex-row gap-2 items-center justify-center">
        <Calendar />
        <span className="text-2xl font-semibold text-center">
          {format(new Date(), "MMMM dd, yyyy")}
        </span>
      </div>

      {/* name of each tab group should be unique */}
      <div className=" max-w-md font-medium shadow-sm rounded-sm">
        <div className="tabs tabs-box">
          <input
            type="radio"
            name="scheduler_type_tabs"
            className="tab flex-1"
            aria-label="Diario"
            onClick={() => toggleView("daily")}
          />
          <input
            type="radio"
            name="scheduler_type_tabs"
            className="tab flex-1"
            aria-label="Semanal"
            onClick={() => toggleView("weekly")}
            defaultChecked
          />
        </div>
      </div>
    </div>
  );
}
