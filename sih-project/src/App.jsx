import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
import LokSamadhanLanding from './Components/LandingPage/LokSamadhanLanding';
import Dashboard from './Components/Dashboard';
import LoginPage from './Components/User/LoginPage';
import SignUpPage from './Components/User/SignUpPage';
import ConfirmSignUpPage from './Components/User/ConfirmSignUpPage';
import ProtectedRoute from './Components/ProtectedRoute';

// Override the Cognito settings from aws-exports with your new Admin Pool details
Amplify.configure({
  ...awsExports,
  "aws_user_pools_id": import.meta.env.VITE_ADMIN_USER_POOL_ID,
  "aws_user_pools_web_client_id": import.meta.env.VITE_ADMIN_USER_POOL_CLIENT_ID,
});

function App() {
  return (
    // The Authenticator.Provider makes authentication state available to all components
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LokSamadhanLanding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/confirm-signup" element={<ConfirmSignUpPage />} />

          {/* Protected Route for the Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Optional: Add a catch-all route for 404 pages */}
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}

export default App;
