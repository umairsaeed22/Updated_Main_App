import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const RequireAuth = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('You need to login first');
    }
  }, [isLoggedIn, location.pathname]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
