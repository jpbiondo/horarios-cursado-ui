import { Calendar } from "lucide-react";
import React from "react";

export default function Schedule() {
  return (
    <section className="mt-8">
      <div className="flex flex-row gap-2 items-center justify-center mb-8">
        <Calendar className="h-8 w-8" />
        <h2 className="text-4xl font-bold text-center">Calendario semanal</h2>
      </div>

      {/* name of each tab group should be unique */}
      <div className="max-w-sm mb-8 mx-auto">
        <div className="tabs tabs-box">
          <input
            type="radio"
            name="scheduler_type_tabs"
            className="tab flex-1"
            aria-label="Diario"
          />
          <input
            type="radio"
            name="scheduler_type_tabs"
            className="tab flex-1"
            aria-label="Semanal"
            defaultChecked
          />
        </div>
      </div>

      <div className="px-8">
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Sábado</th>
                <th>Domingo</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
