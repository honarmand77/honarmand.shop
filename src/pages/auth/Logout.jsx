// src/components/auth/Logout.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../features/auth/authAPI';
import { logout } from '../../features/auth/authSlice';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutMutation().unwrap();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        dispatch(logout());
        navigate('/');
      }
    };
    handleLogout();
  }, [dispatch, navigate, logoutMutation]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">در حال خروج...</p>
      </div>
    </div>
  );
};

export default Logout;