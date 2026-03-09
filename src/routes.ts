import { createBrowserRouter } from "react-router";
import ScheduleEstudiante from "./ScheduleEstudiante";
import Layout from "./Layout";
import ScheduleConsultas from "./ScheduleConsultas";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: ScheduleEstudiante },
      { path: "consultas", Component: ScheduleConsultas },
      { path: "consultas/:modo/:nombre", Component: ScheduleConsultas },
    ],
  },
]);
