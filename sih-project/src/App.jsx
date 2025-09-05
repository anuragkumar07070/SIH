/* sih-project/src/App.jsx */
import React from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Import the default theme

import Dashboard from './Components/Dashboard';
import awsExports from './aws-exports'; // The configuration file from Amplify CLI

// Configure Amplify for your entire app
Amplify.configure(awsExports);

// The 'signOut' and 'user' props are passed in by withAuthenticator
function App({ signOut, user }) {
  return (
    <>
      {/* You can pass the user and signOut function to the Dashboard 
        if you need them there, for example, in your Navbar.
      */}
      <Dashboard user={user} signOut={signOut} />
    </>
  );
}

// Wrap the App component with the Authenticator.
// This will show the login/signup UI before rendering your app.
export default withAuthenticator(App);