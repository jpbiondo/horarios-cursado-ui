export default function DailySchedule() {
  const hours: number[] = Array.from({ length: 16 }, (_, index) => {
    const hour = index + 8;
    return hour;
  });

  return (
    <div className="card bg-base-100 shadow-sm max-w-2xl mx-auto">
      <div className="grid grid-cols-[100px_1fr] bg-black text-white rounded-t-sm font-semibold text-lg text-center">
        <div className="p-3">Hora</div>
        <div className="p-3">Clase</div>
      </div>

      <div className="divide-y relative text-gray-800">
        <div className="absolute divider divider-primary bottom-50 w-full"></div>
        {hours.map((hour, index) => (
          <div
            key={index}
            className="grid grid-cols-[100px_1fr] text-center divide-x"
          >
            <div className="p-3 font-semibold">{`${hour}:00`}</div>
            <div className="p-3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
