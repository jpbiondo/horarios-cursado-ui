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
  day: Day;
  color: string;
}
