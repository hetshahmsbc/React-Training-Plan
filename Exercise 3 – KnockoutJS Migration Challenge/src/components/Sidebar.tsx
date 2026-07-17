// The dark navigation sidebar from the Northvale app.
//
// Only "Jobs" is a live route in this migration; the other items are shown
// (to match the real app) but are read-only placeholders. The NV logo and the
// "Powered by BUILDWATT" footer are recreated with plain markup + CSS.

import { NavLink } from "react-router-dom";
import { Icon } from "./icons";

interface NavItem {
  label: string;
  icon: string;
  hasChildren?: boolean;
}

// The full menu as it appears in the real app (order matters).
const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "DMS", icon: "dms" },
  { label: "Company Admin", icon: "company" },
  { label: "Supply Chain", icon: "supply", hasChildren: true },
  { label: "Purchasing", icon: "purchasing", hasChildren: true },
  { label: "Tenders", icon: "tenders" },
  { label: "Jobs", icon: "jobs" }, // the one live route
  { label: "Sub Contracts", icon: "subcontracts", hasChildren: true },
  { label: "Accounts", icon: "accounts", hasChildren: true },
  { label: "Management", icon: "management" },
  { label: "Admin Config", icon: "admin", hasChildren: true },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">NV</span>
        <span className="sidebar__brand-text">
          <strong>NORTH<span className="accent-green">VALE</span></strong>
          <small>CONSTRUCTION</small>
        </span>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) =>
          item.label === "Jobs" ? (
            <NavLink
              key={item.label}
              to="/"
              className={({ isActive }) => `nav-item${isActive ? " is-active" : ""}`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ) : (
            // Read-only placeholder — present for visual parity, not clickable.
            <button
              key={item.label}
              type="button"
              className="nav-item nav-item--disabled"
              title="Read-only in this migration demo"
              disabled
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.hasChildren ? <Icon name="chevron" size={16} className="nav-item__chevron" /> : null}
            </button>
          ),
        )}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__powered">
          <small>Powered by</small>
          <strong>BUILD<span className="accent-orange">WATT</span></strong>
        </div>
        <button type="button" className="nav-item nav-item--disabled" disabled title="Read-only">
          <Icon name="logout" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
