import logoUtn from "../assets/logo-utn.png";
export default function Header() {
  return (
    <header>
      <div className="flex flex-row items-center gap-2">
        <img src={logoUtn} className="h-12 w-12" />
        <div>
          <h1 className="text-2xl font-bold">Horarios Académicos</h1>
          <p className="text-gray-700">
            Gestiona tus horarios para planificar tu día académico
          </p>
        </div>
      </div>
    </header>
  );
}
