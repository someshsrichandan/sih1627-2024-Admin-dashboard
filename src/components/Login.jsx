// components/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App'; // Import the AuthContext
import { users } from '../data/user'; // Import the hardcoded users

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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
