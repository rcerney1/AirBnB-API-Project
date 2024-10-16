import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import Logo from './Logo';

import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);


  return (
    <nav className="navbar">
      <Logo />
      <ul className="nav-links">
        <li>
          <li>
            {sessionUser && (
              <li>
                <NavLink to='/spots/new' className='create-spot-botton'>Create A New Spot</NavLink>
              </li>
            )}
          </li>
        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
