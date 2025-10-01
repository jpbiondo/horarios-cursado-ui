declare type Day =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

declare interface CalendarEvent {
  title: string;
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
