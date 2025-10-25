import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Global + Scoped Styles */}
      <style jsx>{`
        :root {
          --bg-gradient: linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #F3E8FF 100%);
          --card-bg: rgba(255, 255, 255, 0.85);
          --text-primary: #1F2937;
          --text-secondary: #4B5563;
          --accent: #3B82F6;
          --success: #10B981;
          --danger: #EF4444;
          --shadow-sm: 0 2px 6px rgba(0,0,0,0.1);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
          --shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
          --radius: 16px;
          --radius-sm: 8px;
          --transition: all 0.3s ease;
          --font: 'Inter', sans-serif;
        }

        [data-theme='dark'] {
          --bg-gradient: linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #4c1d95 100%);
          --card-bg: rgba(31, 41, 55, 0.9);
          --text-primary: #f3f4f6;
          --text-secondary: #9ca3af;
          --accent: #60a5fa;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: var(--bg-gradient);
          font-family: var(--font);
          position: relative;
          overflow: hidden;
        }

        .decor-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.3;
        }
        .decor-top { top: -100px; left: -100px; width: 250px; height: 250px; background: radial-gradient(circle, #3b82f6, transparent 70%); }
        .decor-bottom { bottom: -100px; right: -100px; width: 250px; height: 250px; background: radial-gradient(circle, #a78bfa, transparent 70%); }

        .login-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: var(--radius);
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: var(--shadow-lg);
          position: relative;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          text-align: center;
          margin: 0 0 1.5rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .error-alert {
          background: linear-gradient(90deg, #fee2e2, #fecaca);
          color: var(--danger);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
          animation: fadeIn 0.4s ease-out;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #d1d5db;
          border-radius: var(--radius-sm);
          font-size: 1rem;
          background: #f9fafb;
          color: var(--text-primary);
          transition: var(--transition);
        }
        .form-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
          background: white;
        }
        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f3f4f6;
        }

        .btn-primary {
          width: 100%;
          background: linear-gradient(90deg, var(--accent), #60a5fa);
          color: white;
          padding: 0.875rem;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(90deg, #1e40af, var(--accent));
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 1.1rem;
          height: 1.1rem;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .signup-text {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .link-success {
          color: var(--success);
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .link-success:hover {
          color: #059669;
          text-decoration: underline;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .login-card { padding: 2rem; }
          .login-title { font-size: 1.75rem; }
        }
      `}</style>

      <div className="login-page">
        <div className="decor-circle decor-top"></div>
        <div className="decor-circle decor-bottom"></div>

        <div className="login-card" role="main" aria-labelledby="login-title">
          <h2 id="login-title" className="login-title">Login</h2>

          {error && (
            <div className="error-alert" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} aria-label="Login form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
                className="form-input"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
                className="form-input"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              aria-label={loading ? 'Logging in...' : 'Submit login'}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="signup-text">
            Don't have an account?{' '}
            <Link to="/signup" className="link-success">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;