import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Global Styles (CSS-in-JS) */}
      <style jsx>{`
        :root {
          --nav-bg: linear-gradient(90deg, #1E3A8A 0%, #3B82F6 50%, #7C3AED 100%);
          --nav-bg-dark: linear-gradient(90deg, #111827 0%, #1E40AF 50%, #6D28D9 100%);
          --text: #FFFFFF;
          --text-light: #E0F2FE;
          --btn-bg: rgba(255, 255, 255, 0.1);
          --btn-bg-hover: rgba(251, 191, 36, 0.3);
          --btn-login-hover: rgba(59, 130, 246, 0.3);
          --btn-success: linear-gradient(90deg, #10B981, #34D399);
          --btn-success-hover: linear-gradient(90deg, #059669, #10B981);
          --btn-danger: linear-gradient(90deg, #EF4444, #F87171);
          --btn-danger-hover: linear-gradient(90deg, #B91C1C, #DC2626);
          --warning: #FBBF24;
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          --radius: 8px;
          --transition: all 0.3s ease;
        }

        [data-theme='dark'] {
          --nav-bg: var(--nav-bg-dark);
          --text: #f3f4f6;
          --text-light: #bae6fd;
        }

        .navbar {
          background: var(--nav-bg);
          color: var(--text);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: var(--shadow);
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
          min-height: 64px;
        }

        .logo {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-decoration: none;
          color: var(--text);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: var(--transition);
        }

        .logo:hover,
        .logo:focus {
          transform: scale(1.05);
          color: var(--warning);
          outline: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link,
        .welcome-badge,
        .nav-btn {
          font-size: 1rem;
          font-weight: 500;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius);
          text-decoration: none;
          transition: var(--transition);
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: var(--btn-bg);
          color: var(--text);
        }

        .nav-link:hover,
        .nav-link:focus,
        .nav-btn:hover,
        .nav-btn:focus {
          background: var(--btn-bg-hover);
          transform: translateY(-2px);
          outline: none;
        }

        .login-link:hover,
        .login-link:focus {
          background: var(--btn-login-hover);
          transform: translateY(-2px);
        }

        .signup-link {
          background: var(--btn-success);
          border: none;
          color: white;
        }

        .signup-link:hover,
        .signup-link:focus {
          background: var(--btn-success-hover);
          transform: translateY(-2px);
        }

        .logout-btn {
          background: var(--btn-danger);
          border: none;
          color: white;
          cursor: pointer;
        }

        .logout-btn:hover,
        .logout-btn:focus {
          background: var(--btn-danger-hover);
          transform: translateY(-2px);
        }

        .welcome-badge {
          color: var(--text-light);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1rem;
          border-radius: 6px;
        }

        /* Hamburger Menu */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: var(--text);
          border-radius: 2px;
          transition: 0.3s;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }

          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--nav-bg);
            flex-direction: column;
            padding: 1rem;
            gap: 1rem;
            box-shadow: var(--shadow);
            transform: translateY(-150%);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.3s ease, opacity 0.3s ease;
          }

          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
        }
      `}</style>

      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <Link to="/" className="logo" aria-label="CampusConnect Home">
          CampusConnect
        </Link>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/leaderboard" className="nav-link">
                Leaderboard
              </Link>
              <span className="welcome-badge">
                Welcome, {user.name} ({user.role})
              </span>
              <button onClick={onLogout} className="nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link signup-link">
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;