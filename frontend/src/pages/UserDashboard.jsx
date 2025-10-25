import React, { useState, useEffect } from 'react';
import { noticeAPI, registrationAPI } from '../services/api';

function UserDashboard() {
  const [notices, setNotices] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true); // Fixed syntax

  useEffect(() => {
    fetchNotices();
    fetchMyRegistrations();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await noticeAPI.getAll();
      setNotices(response.data);
    } catch (err) {
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const response = await registrationAPI.getMyRegistrations();
      setMyRegistrations(response.data);
    } catch (err) {
      setError('Failed to fetch registrations');
    }
  };

  const isRegistered = (noticeId) => {
    return myRegistrations.some((reg) => reg.notice._id === noticeId);
  };

  const handleRegister = async (noticeId) => {
    setError('');
    setSuccess('');
    try {
      await registrationAPI.register(noticeId);
      setSuccess('Successfully registered for the event!');
      fetchMyRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      {/* Global + Scoped Styles */}
      <style jsx>{`
        :root {
          --bg-gradient: linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #F3E8FF 100%);
          --card-bg: #FFFFFF;
          --text-primary: #1F2937;
          --text-secondary: #4B5563;
          --text-accent: #1E40AF;
          --accent-blue: #3B82F6;
          --accent-green: #10B981;
          --success: #15803D;
          --danger: #B91C1C;
          --shadow-sm: 0 2px 6px rgba(0,0,0,0.1);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
          --shadow-lg: 0 6px 16px rgba(0,0,0,0.2);
          --radius: 12px;
          --radius-sm: 8px;
          --transition: all 0.3s ease;
          --font: 'Inter', sans-serif;
        }

        [data-theme='dark'] {
          --bg-gradient: linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #4c1d95 100%);
          --card-bg: #1f2937;
          --text-primary: #f3f4f6;
          --text-secondary: #9ca3af;
          --text-accent: #60a5fa;
        }

        .dashboard {
          max-width: 1000px;
          margin: 3rem auto;
          padding: 0 1.5rem;
          font-family: var(--font);
          background: var(--bg-gradient);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
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
        .decor-top { top: -50px; left: -50px; width: 150px; height: 150px; background: radial-gradient(circle, #3b82f6, transparent 70%); }
        .decor-bottom { bottom: -50px; right: -50px; width: 150px; height: 150px; background: radial-gradient(circle, #a78bfa, transparent 70%); }

        .title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-accent);
          text-align: center;
          margin-bottom: 2.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }
        .title:hover { color: #2563eb; }

        .alert {
          padding: 1rem 1.5rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-size: 1rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
          animation: fadeIn 0.5s ease-in;
          position: relative;
          z-index: 1;
        }
        .alert-error { background: linear-gradient(90deg, #fee2e2, #fecaca); color: var(--danger); }
        .alert-success { background: linear-gradient(90deg, #dcfce7, #bbf7d0); color: var(--success); }

        .section-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-accent);
          margin: 2.5rem 0 1.5rem;
          border-bottom: 3px solid var(--accent-blue);
          padding-bottom: 0.75rem;
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }
        .section-title:hover { color: #2563eb; }

        .status-card {
          text-align: center;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          background: linear-gradient(90deg, #f9fafb, #f3f4f6);
          color: var(--text-secondary);
          position: relative;
          z-index: 1;
        }

        .event-card {
          background: var(--card-bg);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
          border-left: 4px solid var(--accent-blue);
          transition: var(--transition);
          position: relative;
          z-index: 1;
        }
        .event-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }

        .reg-card {
          background: #E0F2FE;
          border-left: 4px solid var(--accent-green);
        }
        .reg-card:nth-child(even) { background: #F3E8FF; }
        .reg-card:hover { background: #BAE6FD; }
        .reg-card:nth-child(even):hover { background: #DDD6FE; }

        .event-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.75rem;
        }
        .event-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 0 0 1rem;
          line-height: 1.5;
        }
        .event-meta {
          font-size: 1rem;
          color: #374151;
          margin: 0 0 0.75rem;
        }
        .event-date {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 1rem;
        }

        .btn {
          padding: 0.6rem 1.4rem;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-register {
          background: linear-gradient(90deg, var(--accent-blue), #60a5fa);
          color: white;
        }
        .btn-register:hover {
          background: linear-gradient(90deg, #1e40af, var(--accent-blue));
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .btn-register:focus {
          outline: 3px solid rgba(59,130,246,0.3);
          outline-offset: 2px;
        }
        .btn-disabled {
          background: linear-gradient(90deg, var(--accent-green), #34d399);
          color: white;
          opacity: 0.7;
          cursor: not-allowed;
        }

        .registered-check {
          color: var(--accent-green);
          font-weight: 500;
          font-size: 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .dashboard { margin: 1.5rem; padding: 1rem; }
          .title { font-size: 1.875rem; }
          .event-card, .reg-card { padding: 1.25rem; }
          .btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="dashboard" role="main" aria-labelledby="dashboard-title">
        <div className="decor-circle decor-top"></div>
        <div className="decor-circle decor-bottom"></div>

        <h1 id="dashboard-title" className="title">User Dashboard</h1>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="status">{success}</div>}

        {/* My Registrations */}
        <section aria-labelledby="my-reg-title">
          <h2 id="my-reg-title" className="section-title">My Registrations</h2>
          {loading ? (
            <div className="status-card">Loading registrations...</div>
          ) : myRegistrations.length === 0 ? (
            <div className="status-card">You haven't registered for any events yet.</div>
          ) : (
            myRegistrations.map((reg) => (
              <article key={reg._id} className="event-card reg-card">
                <h3 className="event-title">{reg.notice.title}</h3>
                <p className="event-desc">{reg.notice.description}</p>
                <p className="event-meta">
                  <strong>Event Date:</strong>{' '}
                  {new Date(reg.notice.eventDate).toLocaleDateString()}
                </p>
                <p className="registered-check">Registered</p>
              </article>
            ))
          )}
        </section>

        {/* All Events */}
        <section aria-labelledby="all-events-title">
          <h2 id="all-events-title" className="section-title">All Events</h2>
          {loading ? (
            <div className="status-card">Loading events...</div>
          ) : notices.length === 0 ? (
            <div className="status-card">No events available.</div>
          ) : (
            notices.map((notice) => {
              const registered = isRegistered(notice._id);
              return (
                <article key={notice._id} className="event-card">
                  <h3 className="event-title">{notice.title}</h3>
                  <p className="event-desc">{notice.description}</p>
                  <p className="event-meta">
                    <strong>Event Date:</strong>{' '}
                    {new Date(notice.eventDate).toLocaleDateString()}
                  </p>
                  <p className="event-date">
                    <small>Posted on: {new Date(notice.createdAt).toLocaleDateString()}</small>
                  </p>
                  {registered ? (
                    <button className="btn btn-disabled" disabled aria-label="Already registered">
                      Already Registered
                    </button>
                  ) : (
                    <button
                      className="btn btn-register"
                      onClick={() => handleRegister(notice._id)}
                      aria-label="Register for event"
                    >
                      Register for Event
                    </button>
                  )}
                </article>
              );
            })
          )}
        </section>
      </div>
    </>
  );
}

export default UserDashboard;