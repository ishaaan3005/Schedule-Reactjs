// logInPage.js
import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Logout = () => {
  return (
    <div>
      <h2>Sign In</h2>
      <SignIn />
    </div>
  );
};

export default Logout;
