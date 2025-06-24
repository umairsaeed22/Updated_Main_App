import { Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/authentication/Login';
import ForgotPassword from './pages/authentication/ForgotPassword';
import AuthLayout from './components/authentication/AuthLayout';
import MainDashboardLayout from './components/mainDashboard/MainDashboardLayout';
import MainDashboard from './pages/main/MainDashboard';
import Settings from './pages/main/Settings';
import SettingsHome from './pages/main/SettingsHome';
import PasswordSettings from './pages/main/PasswordSettings';
import LanguageSettings from './pages/main/LanguageSettings';
import Support from './pages/main/Support';
import HelpCenter from './pages/main/HelpCenter';


import ThemeSettings from './pages/main/ThemeSettings';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/security/ProtectedRoute.jsx';
import AccessDenied from './components/security/AccessDenied.jsx';
import AdminAssignSettings from './pages/main/AdminAssignSettings.jsx';
import AutoLogout from './components/security/AutoLogout.jsx';
import RequireAuth from './components/security/RequireAuth.jsx';
const IncentiveApp = lazy(() => import('./apps/incentive_app/index.jsx'));

const UserManagementApp = lazy(() =>
  import('./apps/user_management_app/index.jsx'),
);

const MobileSerialApp = lazy(() =>
  import('./apps/mobile_serail_app/index.jsx'),
);

function App() {
  return (
    <>
      <AutoLogout />
      <Routes>
        <Route path="/forbidden" element={<AccessDenied />} />
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="forgot" element={<ForgotPassword />} />
        </Route>

        <Route
          path="/mainDashboard"
          element={
            <ProtectedRoute>
              <MainDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MainDashboard />} />
          <Route path="support" element={<Support />} />
          <Route path="helpCenter" element={<HelpCenter />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<SettingsHome />} />
            <Route path="passwordSettings" element={<PasswordSettings />} />
            <Route path="languageSettings" element={<LanguageSettings />} />
            <Route path="themeSettings" element={<ThemeSettings />} />
            <Route path="adminAssign" element={<AdminAssignSettings />} />
          </Route>
        </Route>

        {/**Mobile serial app routes */}
        <Route
          path="/mobile-serial-app/*"
          element={
            <Suspense fallback={''}>
              <MobileSerialApp />
            </Suspense>
          }
        />

        {/**Incentive app routes */}

        <Route
          path="/incentive/*"
          element={
            <ProtectedRoute
              requiredRoles={[
                'salesperson',
                'storeManager',
                'operationsManager',
              ]}
              appId="incentive-app"
            >
              <Suspense fallback={''}>
                <IncentiveApp />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/**User management app */}
        <Route
          path="/userManagment/*"
          element={
            <ProtectedRoute
              requiredRoles={['iT_manager']}
              appId="userManagement-app"
            >
              <Suspense fallback={''}>
                <UserManagementApp />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
