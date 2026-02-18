declare interface CalendarEvent {
  title: string;
  desc: string;
  startHour: string;
  endHour: string;
  day: string;
  color: string;
}

declare interface Subject {
  id: string;
  name: string;
  commission: string;
  semester: "Primero" | "Segundo";
  career: string;
  calendar: SubjectEvent[];
}

declare interface SubjectEvent {
  day: Day;
  startHour: string;
  endHour: string;
}
