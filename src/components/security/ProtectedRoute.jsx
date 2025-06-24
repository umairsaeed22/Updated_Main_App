import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

let lastPathname = '';
let toastTimeout;

const ProtectedRoute = ({ requiredRoles = [], appId, children }) => {
  const { isLoggedIn, apps } = useAuthStore();
  const location = useLocation();

  // ❌ Not logged in
  const isAuthStoragePresent = localStorage.getItem('auth-storage');
  if (!isLoggedIn || !isAuthStoragePresent) {

    const comingFrom = location.pathname;

    // ✅ Show toast only if the user is navigating manually
    if (lastPathname !== comingFrom) {
      toast.error('You need to login first');
      lastPathname = comingFrom;

      // reset after short time
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        lastPathname = '';
      }, 1000);
    }

    return <Navigate to="/" replace />;
  }

  // ✅ No appId → allow
  if (!appId) return children;

  // ❌ App not found → forbidden
  const userApp = apps.find((userApp) => userApp.appID === appId);
  if (!userApp) {
    return <Navigate to="/forbidden" replace />;
  }

  // ❌ Role check
  const activeRole = userApp.role?.toLowerCase() || '';
  const hasRoleAccess =
    requiredRoles.length === 0 ||
    requiredRoles.some((r) => r.toLowerCase() === activeRole);

  if (!hasRoleAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
