import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const SESSION_DURATION = 30 * 60 * 1000; // 3 minutes
const AutoLogout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loginTime, logout } = useAuthStore();
  useEffect(() => {
    if (!isLoggedIn || !loginTime) return;

    const now = Date.now();
    const timeLeft = SESSION_DURATION - (now - loginTime);

    if (timeLeft <= 0) {
      logout();
      toast.error('Session expired. Please login again.');
      navigate('/');
      return;
    }

    const timeout = setTimeout(() => {
      logout();
      toast.error('Session expired. Please login again.');
      navigate('/');
    }, timeLeft);

    return () => clearTimeout(timeout);
  }, [isLoggedIn, loginTime]);
  return null;
};

export default AutoLogout;
