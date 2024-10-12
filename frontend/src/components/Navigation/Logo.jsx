// Logo.jsx
import { NavLink } from 'react-router-dom';


function Logo() {
    return (
        <div className="logo">
            <NavLink to="/">
                <img src="https://media.printables.com/media/prints/562320/images/4506380_17315eaf-7399-4388-80f8-b15bc7c86992/straw-hat-logo.png" alt="Logo" />
            </NavLink>
        </div>
    );
}

export default Logo;
