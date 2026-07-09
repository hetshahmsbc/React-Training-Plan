// Navbar — <NavLink> navigation.

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">🏢 HR Portal</div>
      <nav className="navbar__links">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/employees">Employees</NavLink>
      </nav>
    </header>
  );
}
