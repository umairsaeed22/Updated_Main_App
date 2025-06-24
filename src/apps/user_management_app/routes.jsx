import { Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../../components/security/ProtectedRoute';

const UserManagementLayout = lazy(() =>
  import('./components/layout/UserManagementLayout'),
);

const UserManagementMain = lazy(() => import('./pages/UserManagementMain'));

const routes = (
  <Route
    path="userManagment"
    element={
      <ProtectedRoute requiredRoles={['iT_manager']} appId="userManagement-app">
        <Suspense fallback={<div>Loading layout...</div>}>
          <UserManagementLayout />
        </Suspense>
      </ProtectedRoute>
    }
  >
    <Route
      index
      element={
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <UserManagementMain />
        </Suspense>
      }
    />
  </Route>
);

export default routes;
