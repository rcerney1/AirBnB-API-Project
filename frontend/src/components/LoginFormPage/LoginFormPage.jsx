import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 

    try {
      await dispatch(sessionActions.login({ credential, password }));
      
    } catch (res) {
      const data = await res.json();
     
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ general: "Login failed. Please try again." }); // Generic error message
      }
    }
  };

  return (
    <div className="login-form-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email" // Placeholder updated
          />
        </label>
        {errors.credential && <p className="error">{errors.credential}</p>} {/* Display credential error */}
        
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>} {/* Display password error */}
        
        {errors.general && <p className="error">{errors.general}</p>} {/* Display general error message */}
        
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormPage;
