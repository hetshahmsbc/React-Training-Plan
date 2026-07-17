// App shell: white icon-sidebar (off-canvas drawer on mobile) + top bar with the
// current page title and the signed-in user.

import { useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV_BY_ROLE } from '../lib/roles';
import { Avatar } from './Avatar';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { to: '/appointments', label: 'Appointments', icon: <IconCalendar /> },
  { to: '/doctors', label: 'Doctors', icon: <IconDoctor /> },
  { to: '/patients', label: 'Patients', icon: <IconUsers /> },
  { to: '/pharmacy', label: 'Pharmacy', icon: <IconPill /> },
  { to: '/prescriptions', label: 'Prescriptions', icon: <IconFile /> },
  { to: '/billing', label: 'Billing', icon: <IconReceipt /> },
  { to: '/meet', label: 'Video Consult', icon: <IconVideoCam /> },
];

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/appointments': 'Appointments',
  '/doctors': 'Doctors',
  '/patients': 'Patients',
  '/pharmacy': 'Pharmacy',
  '/prescriptions': 'Prescriptions',
  '/billing': 'Billing',
  '/meet': 'Video Consultation',
};

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const title = TITLES[location.pathname] ?? 'Dashboard';

  const allowed = user ? NAV_BY_ROLE[user.role] : [];
  const nav = NAV.filter((item) => allowed.includes(item.to));
  const roleLabel = user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('hms-theme', next ? 'dark' : 'light');
  };

  return (
    <div className="hms-layout">
      {open && <div className="hms-overlay" onClick={() => setOpen(false)} />}

      <aside className={`hms-sidebar${open ? ' hms-sidebar--open' : ''}`}>
        <div className="hms-brand">
          <IconLogo /> HMS Clinic
        </div>
        <nav className="hms-nav">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="hms-logout" onClick={logout}>
          <IconLogout /> Logout
        </button>
      </aside>

      <div className="hms-main">
        <header className="hms-topbar">
          <div className="hms-topbar__left">
            <button className="hms-hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
              <IconMenu />
            </button>
            <span className="hms-topbar__title">{title}</span>
          </div>
          <div className="hms-user">
            <button className="hms-themetoggle" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {dark ? <IconSun /> : <IconMoon />}
            </button>
            <span className="hms-bell" title="Notifications">
              <IconBell />
            </span>
            <div className="hms-user__block">
              <div className="hms-user__meta">
                <div className="hms-user__name">{user?.name}</div>
                <div className="hms-user__role">{roleLabel}</div>
              </div>
              <Avatar name={user?.name || 'User'} size={40} />
            </div>
          </div>
        </header>
        <main className="hms-content">{children}</main>
      </div>
    </div>
  );
}

/* --- Inline SVG icons (stroke = currentColor, no icon library) ----------- */
function svg(children: ReactNode) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
function IconDashboard() {
  return svg(<>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </>);
}
function IconCalendar() {
  return svg(<>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </>);
}
function IconDoctor() {
  return svg(<>
    <circle cx="12" cy="7" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </>);
}
function IconUsers() {
  return svg(<>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </>);
}
function IconPill() {
  return svg(<>
    <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </>);
}
function IconFile() {
  return svg(<>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h6" />
  </>);
}
function IconReceipt() {
  return svg(<>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </>);
}
function IconVideoCam() {
  return svg(<>
    <path d="m23 7-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </>);
}
function IconLogout() {
  return svg(<>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </>);
}
function IconMenu() {
  return svg(<path d="M3 12h18M3 6h18M3 18h18" />);
}
function IconBell() {
  return svg(<>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </>);
}
function IconMoon() {
  return svg(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />);
}
function IconSun() {
  return svg(<>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>);
}
function IconLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#2f6bed">
      <rect width="24" height="24" rx="6" />
      <path d="M10.5 5h3v4h4v3h-4v4h-3v-4h-4V9h4V5z" fill="#fff" />
    </svg>
  );
}
