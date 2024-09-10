// components/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App'; // Import the AuthContext
import { users } from '../data/user'; // Import the hardcoded users
import './login.css';
import drug1 from '../assets/images/drug1.jpeg';
// import drug2 from "../assets/images/drug2.jpeg";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleLogin } = useContext(AuthContext); // Get handleLogin from context

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate user credentials
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      handleLogin(user); // Call the handleLogin function with the user object
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
    <h1>online drug inventory and supply chain tracking system</h1>
    
    <div className='login'> 
    <img className='drug1' src={drug1} alt="drug1 image" />
    {/* <img className='drug2' src={drug2} alt="drug2 image" /> */}

    <div className='login-card'> 
      <h2>Login</h2>
      <form className='form' onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <button type="sumbit" className='forgot'> forgot password ?</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      </div>
    </div>
  );
};

export default Login;
