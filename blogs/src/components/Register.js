// Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "../Style/Login.css"

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Register failed');
      }
    } catch (error) {
      console.error('Error during register:', error);
    }
  };

  return (
    <div>
      <div className="login-dialog">
        <h2>Register</h2>
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
          <button type="button" onClick={handleRegister}>Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
