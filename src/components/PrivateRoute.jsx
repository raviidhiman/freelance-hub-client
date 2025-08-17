// components/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child components
  return children ? children : <Outlet />;
};

export default PrivateRoute;