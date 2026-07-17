// App shell: sidebar + scrollable content area + the footer bar. Wraps every
// page so the chrome (branding, footer, version) is consistent — the React
// equivalent of the shared `_Layout.cshtml`.

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="app__main">
        <main className="app__content">
          <Outlet />
        </main>
        <footer className="app__footer">
          <span className="app__footer-user">admin - Northvale Construction Limited</span>
          <span className="app__footer-copy">
            © Copyright 2023. All Rights Reserved by BUILDWATT · Privacy Policy
          </span>
          <span className="app__footer-version">Version 11.5.2.0</span>
        </footer>
      </div>
    </div>
  );
}
