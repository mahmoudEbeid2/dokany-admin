import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store'; 
import { setUserFromToken } from '../../store/slices/authSlice';
import LoaderSpinner from '../ui/Loader';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>(); 
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setUserFromToken(token)); 
    }
    setCheckingAuth(false);
  }, [dispatch]);

  if (loading || checkingAuth) {
    return <LoaderSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;

