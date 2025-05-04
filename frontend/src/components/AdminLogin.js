import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPage.css';
import whitworthLogo from '../assets/whitworth-logo.png'; // Import the logo directly

const AdminLogin = () => {
  // For testing, set the values in the form to admin credentials.
  // Provides easy access to the dashboard
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { 
        username, 
        password 
      }, {
        withCredentials: true // Important for cookies
      });
      
      if (response.data.success) {
        navigate('/admin/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // handle login logic here

  return (
    <div className="admin-login-container">
      <div className="container">
        <div className="logo">
          <img 
            src={whitworthLogo}  // This needs fixing still so that it will display on the front page 
            alt="Whitworth University Logo" 
          />
        </div>
        
        <h1>Admin Dashboard</h1>
        <div className="header-subtitle">Secure Administrator Access</div>

        {error && <div className="error-message">{error}</div>}

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