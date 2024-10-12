import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  //const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // if (sessionUser){
  //   return <Navigate to="/" replace={true} />;
  // } 

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
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

export default LoginFormModal;
