import React, { useState } from 'react';

const Register = ({ navigate }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Registration successful! Please log in.');
        setTimeout(() => navigate('login'), 1000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Background Gradient */}
      <div className="auth-background" />
      

      
      {/* Register Form */}
      <div className="auth-container">
        <div className="auth-content">
          {/* Logo */}
          <div className="auth-logo">
            <h1 className="auth-logo-title">StreamFlix</h1>
            <p className="auth-logo-subtitle">Create your account</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="auth-form-title">Sign Up</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-username">
                Username
              </label>
              <input
                type="text"
                id="reg-username"
                className="auth-input"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="auth-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="reg-password">
                Password
              </label>
              <input
                type="password"
                id="reg-password"
                className="auth-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="auth-button"
            >
              Create Account
            </button>
            
            <p className="auth-link">
              Already have an account?{' '}
              <a onClick={() => navigate('login')}>
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
