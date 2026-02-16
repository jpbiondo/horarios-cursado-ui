# Horarios UTN

Aplicación web para armar y visualizar horarios de materias de la UTN. Permite crear varios perfiles, explorar posibles combinaciones de cursadas y exportar a PNG o calendario ICS.

## Funcionalidades

- **Buscar materias** por carrera, plan y comisión
- **Crear perfiles** para especular diferentes horarios del semestre
- **Vista semanal** con indicador de hora actual
- **Exportar** a imagen PNG o archivo ICS (Google Calendar, Outlook, etc.)
- **Tema claro/oscuro**
- **Responsive** con sidebar en desktop y sheet en móvil

## Cómo usar

1. Selecciona carrera, plan y comisión
2. Busca las materias y añádelas al horario
3. Crea perfiles para comparar distintas combinaciones
4. Exporta tu horario final

Los datos se guardan en `localStorage` (sin backend).

## Desarrollo

```bash
npm install
npm run dev
```

## Tests

```bash
npm run test        # single run
npm run test:watch  # watch mode
```

## Build

```bash
npm run build
```

## Configuración

- **Fechas del semestre** para exportar ICS: editar `src/constants/index.ts` (`SEMESTER_START`, `SEMESTER_END`)

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Supabase (API de carreras/planes/comisiones)
