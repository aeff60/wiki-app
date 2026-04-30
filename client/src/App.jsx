import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { SpaceListPage } from './pages/SpaceListPage.jsx';
import { SpacePage } from './pages/SpacePage.jsx';
import { PageNewPage } from './pages/PageNewPage.jsx';
import { PageViewPage } from './pages/PageViewPage.jsx';
import { PageEditPage } from './pages/PageEditPage.jsx';
import { RevisionPage } from './pages/RevisionPage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.jsx';
import { UserManagementPage } from './pages/admin/UserManagementPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="spaces" element={<SpaceListPage />} />
          <Route path="spaces/:spaceId" element={<SpacePage />} />
          <Route path="spaces/:spaceId/pages/new" element={
            <ProtectedRoute minRole="editor"><PageNewPage /></ProtectedRoute>
          } />
          <Route path="spaces/:spaceId/pages/:pageId" element={<PageViewPage />} />
          <Route path="spaces/:spaceId/pages/:pageId/edit" element={
            <ProtectedRoute minRole="editor"><PageEditPage /></ProtectedRoute>
          } />
          <Route path="spaces/:spaceId/pages/:pageId/history" element={<RevisionPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="admin" element={
            <ProtectedRoute minRole="admin"><AdminDashboardPage /></ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute minRole="admin"><UserManagementPage /></ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
