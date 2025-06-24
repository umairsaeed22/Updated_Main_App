import { Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../../components/security/ProtectedRoute';
const SalesPersonLayout = lazy(() =>
  import('./salesperson/components/SalesPersonLayout'),
);
const SalesPersonDashboard = lazy(() =>
  import('./salesperson/pages/dashboard/SalesPersonDashboard'),
);

const routes = (
  <Route
    path="salesperson"
    element={
      <ProtectedRoute requiredRoles={['salesperson']} appId="incentive-app">
        <Suspense fallback={<div>Loading layout...</div>}>
          <SalesPersonLayout />
        </Suspense>
      </ProtectedRoute>
    }
  >
    <Route
      index
      element={
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <SalesPersonDashboard />
        </Suspense>
      }
    />
  </Route>
);

export default routes;
