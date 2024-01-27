import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "../Style/Login.css"

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.token);
        navigate('/my-posts')
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <div className="login-dialog">
        <h2>Login</h2>
        <form className="login-form">
          <div className="form-group">
            <label for="username">Username:</label>
            <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label for="password">Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
          <button type="button" onClick={handleLogin}>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
