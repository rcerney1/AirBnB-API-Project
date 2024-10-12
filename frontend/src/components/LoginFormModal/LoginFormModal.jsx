import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json(); 
        console.log(data);
        if (data && data.errors) {
          setErrors(data.message);
        } else if (data && data.message) {
          setErrors({ general: data.message }); // Handle a general error if applicable
        }
      });
  };

  // Check if the button should be disabled
  const isButtonDisabled = credential.length < 4 || password.length < 6;

  const handleDemoLogin = () => {
    const demoUser = {
      credential: "Demo-lition", // replace with the actual demo username/email
      password: "password" // replace with the actual demo password
    };

    return dispatch(sessionActions.login(demoUser))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log(data);
        if (data && data.errors) {
          setErrors(data.message);
        } else if (data && data.message) {
          setErrors({ general: data.message }); // Handle a general error if applicable
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
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.general && <p className="error">The provided credentials were invalid</p>}
        
        <button type="submit" disabled={isButtonDisabled}>Log In</button>
      </form>

      <button onClick={handleDemoLogin} className="demo-user-button">
        Log in as Demo User
      </button>
    </div>
  );
}

export default LoginFormModal;
