// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ensure the correct import path for AuthContext
import { users } from '../data/user'; // Import the hardcoded users array
import './login.css'; // Import your CSS styles
import drug1 from '../assets/images/drug1.jpeg';
// import drug2 from "../assets/images/drug2.jpeg";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleLogin } = useContext(AuthContext); // Access the handleLogin function from AuthContext

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate user credentials against the hardcoded users array
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      handleLogin(user); // Call the handleLogin function with the valid user object
    } else {
      setError('Invalid username or password'); // Set error message if credentials don't match
    }
  };

  return (
    <div>
      <h1>Online Drug Inventory and Supply Chain Tracking System</h1>

      <div className='login'>
        <img className='drug1' src={drug1} alt="drug1" />
        {/* <img className='drug2' src={drug2} alt="drug2" /> */}

        <div className='login-card'>
          <h2>Login</h2>
          <form className='form' onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <button type="button" className='forgot'>Forgot Password?</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
