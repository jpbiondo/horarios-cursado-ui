import React from "react";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-100 items-center p-4 mt-8">
      <p className="mx-auto">
        {new Date().getFullYear()} - Desarrollado por algún alumno random
      </p>
    </footer>
  );
}
