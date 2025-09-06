import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const location = useLocation();

  // Show a loading indicator while Amplify is checking the auth status
  if (authStatus === 'configuring') {
    return (
        <div className="flex items-center justify-center h-screen">
            <div>Loading...</div>
        </div>
    );
  }

  // If the user is not authenticated, redirect them to the login page
  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the component that was passed in (e.g., the Dashboard)
  return children;
};

export default ProtectedRoute;
