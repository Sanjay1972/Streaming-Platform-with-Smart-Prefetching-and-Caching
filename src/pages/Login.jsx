import React, { useState } from 'react';

const Login = ({ navigate, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
        navigate('home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Background Gradient */}
      <div className="auth-background" />
      

      
      {/* Login Form */}
      <div className="auth-container">
        <div className="auth-content">
          {/* Logo */}
          <div className="auth-logo">
            <h1 className="auth-logo-title">StreamFlix</h1>
            <p className="auth-logo-subtitle">Sign in to continue</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="auth-form-title">Sign In</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="auth-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="auth-button"
            >
              Sign In
            </button>
            
            <p className="auth-link">
              Don't have an account?{' '}
              <a onClick={() => navigate('register')}>
                Register
              </a>
            </p>
            
            <p className="auth-demo">
              Demo credentials: user / password
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
