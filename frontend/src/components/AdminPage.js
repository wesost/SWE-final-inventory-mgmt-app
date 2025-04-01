import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPage.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/adminDashboard');
    // handle login logic here
    console.log('Login attempt with:', { username, password });
  };

  return (
    <div className="admin-login-container">
      <div className="container">
        <div className="logo">
          <img 
            src={process.env.PUBLIC_URL + '/WhitworthLogo.png'}  // This needs fixing still so that it will display on the front page 
            alt="Whitworth University Logo" 
          />
        </div>
        
        <h1>Admin Dashboard</h1>
        <div className="header-subtitle">Secure Administrator Access</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;