import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import SignInPage from './SignInPage';
import SignOutButton from './SignOutButton';
import Navbar from './Navbar';
import LandingPage from './LandingPage'; // Import the LandingPage component
import { AppointmentProvider } from './AppointmentContext'; // Import the AppointmentProvider
import HomePage from './HomePage';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';

const App = () => {
  const clerkPublishableKey = 'pk_test_c3Vubnktb3NwcmV5LTIyLmNsZXJrLmFjY291bnRzLmRldiQ'; // Your Clerk publishable key

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <AppointmentProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signout" element={<SignOutButton />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/book" element={<AppointmentForm />} />
            <Route path="/schedule" element={<AppointmentList />} />
            
          </Routes>
        </Router>
      </AppointmentProvider>
    </ClerkProvider>
  );
};

const MainPage = () => {
  const { user } = useUser();

  if (user) {
    return <LandingPage />;
  } else {
    return  <SignInPage/>; // Return null if user is not authenticated
  }
};

export default App;
