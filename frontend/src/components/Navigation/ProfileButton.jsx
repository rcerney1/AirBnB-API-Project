// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa'; // Import burger menu icon
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent click from bubbling up and closing the menu immediately
    setShowMenu(!showMenu); // Toggle menu visibility
  };

  useEffect(() => {
    if (!showMenu) return; // If the menu is not shown, do nothing

    const closeMenu = (e) => {
      // Close the menu only if the click target is not inside the dropdown
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu); // Listen for clicks on the document

    return () => document.removeEventListener('click', closeMenu); // Cleanup the listener
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    dispatch(sessionActions.logout()); // Dispatch logout action
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden"); // Determine class for dropdown visibility

  return (
    <>
      <button className="profile-button" onClick={toggleMenu}>
        <FaBars className="burger-icon" />
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>Username: {user.username}</li>
        <li>Name: {user.firstName} {user.lastName}</li>
        <li>Email: {user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
