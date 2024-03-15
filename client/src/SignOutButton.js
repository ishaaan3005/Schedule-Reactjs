import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/'); // Redirect to homepage after sign out
  };

  return (
    <button className="dropdownLink" onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutButton;
