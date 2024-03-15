import React from 'react';
import { useUser, SignIn, SignOutButton } from '@clerk/clerk-react';
import LandingPage from './LandingPage'; // Import the LandingPage component

const HomePage = () => {
  const { user } = useUser();
  console.log('User:', user); // Log user authentication status

  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      {user ? (
        <LandingPage /> // Render LandingPage component when user is logged in
      ) : (
        <SignIn />
      )}
      {/* Add your home page content here */}
    </div>
  );
};

export default HomePage;
