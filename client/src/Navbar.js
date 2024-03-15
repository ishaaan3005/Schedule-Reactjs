import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import SignOutButton from './SignOutButton';

const Navbar = () => {
  const { signedIn } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/schedule" style={styles.navLink}>Scheduled Appointments</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/book" style={styles.navLink}>Book Appointment</Link>
        </li>
        <li style={styles.navItem}>
          <div className="dropdown">
            <button className="dropbtn" onClick={toggleDropdown}>Account</button>
            {showDropdown && (
              <div className="dropdown-content" style={styles.dropdownContent}>
                {signedIn ? (
                  <>
                    <SignOutButton />
                    <Link to="/" style={styles.dropdownLink}>My Account</Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" style={styles.dropdownLink}>Sign Up</Link>
                    <Link to="/signin" style={styles.dropdownLink}>Sign In</Link>
                    <Link to="/" style={styles.dropdownLink}>Logout</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#333',
    padding: '10px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
  },
  navList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  navItem: {
    margin: '0 10px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '3px',
    transition: 'background-color 0.3s ease',
  },
  dropdownContent: {
    display: 'block',
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    minWidth: '160px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  dropdownLink: {
    textDecoration: 'none',
    color: '#333',
    padding: '12px 16px',
    display: 'block',
    transition: 'background-color 0.3s ease',
  },
};

export default Navbar;
