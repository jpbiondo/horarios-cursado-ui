export const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb"];

export const DAY_HOURS = 24;

/** Fechas del semestre para exportar ICS. Ajustar según el ciclo lectivo. */
const CURRENT_YEAR = new Date().getFullYear();
export const SEMESTER_START = new Date(CURRENT_YEAR, 0, 1); // 1 de febrero 2026
export const SEMESTER_END = new Date(CURRENT_YEAR, 5, 26, 23, 59, 59); // 26 de junio 2026

/** ID del semestre activo en la tabla semestre. Ajustar según tu base de datos. */
export const CURRENT_SEMESTRE_ID = 1;
