// Routes for the migrated screens, all inside the shared Layout (sidebar +
// footer). In the old MVC app these were server routes on JobsController; here
// they're client routes, so moving between them never reloads the page.
//
// Flow mirrors the real app:
//   /                          Jobs list
//   /jobs/add                  Add new job (form)
//   /jobs/:jobId               Job dashboard (tiles)  — read-only
//   /jobs/:jobId/general-details   Edit job (form)
//   /jobs/:jobId/directory     Job directory + team   — read-only

import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { JobDashboardPage } from "./pages/JobDashboardPage";
import { JobDirectoryPage } from "./pages/JobDirectoryPage";
import { JobFormPage } from "./pages/JobFormPage";
import { JobsListPage } from "./pages/JobsListPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<JobsListPage />} />
        <Route path="/jobs/add" element={<JobFormPage />} />
        <Route path="/jobs/:jobId" element={<JobDashboardPage />} />
        <Route path="/jobs/:jobId/general-details" element={<JobFormPage />} />
        <Route path="/jobs/:jobId/directory" element={<JobDirectoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
