// src/App.jsx
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

// This is the crucial step:
// We start with the base aws-exports config but override the Cognito settings
// to point to your NEW Admin User Pool and Admin Identity Pool.
Amplify.configure({
  ...awsExports, // Keep other settings like API Gateway URL
  "aws_user_pools_id": import.meta.env.VITE_ADMIN_USER_POOL_ID,
  "aws_user_pools_web_client_id": import.meta.env.VITE_ADMIN_USER_POOL_CLIENT_ID,
  "aws_cognito_identity_pool_id": import.meta.env.VITE_ADMIN_IDENTITY_POOL_ID,
});

function App() {
  return (
    // The Authenticator.Provider makes the user's login state
    // available to all components via the `useAuthenticator` hook.
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - Anyone can visit these */}
          <Route path="/" element={<LokSamadhanLanding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/confirm-signup" element={<ConfirmSignUpPage />} />

          {/* Protected Route for the Dashboard */}
          {/* The ProtectedRoute component will check if the user is logged in.
              If not, it will redirect them to the /login page. */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* A simple 404 page for any routes that don't match */}
          <Route path="*" element={<h1 className="text-center p-8">404: Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}

export default App;

