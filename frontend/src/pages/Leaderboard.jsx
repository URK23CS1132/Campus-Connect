import React, { useEffect, useState } from 'react';
import { registrationAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    setLoading(true);
    setError(null);
    registrationAPI
      .getLeaderboard()
      .then((response) => {
        setLeaders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load leaderboard. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    if (!user) return;
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
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
          --accent: #3B82F6;
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

        .leaderboard-container {
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

        .back-btn {
          background: linear-gradient(90deg, var(--accent), #60a5fa);
          color: white;
          padding: 0.6rem 1.4rem;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }
        .back-btn:hover, .back-btn:focus {
          background: linear-gradient(90deg, #1e40af, var(--accent));
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          outline: none;
        }

        .title {
          font-size: 2rem;
          font-weight: 600;
          color: var(--text-accent);
          text-align: center;
          margin-bottom: 2rem;
          border-bottom: 3px solid var(--accent);
          padding-bottom: 0.75rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }
        .title:hover { color: #2563eb; }

        .table-card {
          background: linear-gradient(90deg, var(--card-bg), #f9fafb);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          padding: 2rem;
          overflow-x: auto;
          position: relative;
          z-index: 1;
          border-left: 4px solid var(--accent);
        }

        .status-card {
          text-align: center;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          background: linear-gradient(90deg, #f9fafb, #f3f4f6);
          color: var(--text-secondary);
          font-size: 1rem;
        }
        .error-card {
          background: linear-gradient(90deg, #fee2e2, #fecaca);
          color: #b91c1c;
          animation: fadeIn 0.5s ease-in;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.75rem;
        }

        thead th {
          text-align: left;
          padding: 1rem 1.5rem;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          background: rgba(59,130,246,0.1);
          border-bottom: 2px solid var(--accent);
        }
        thead th:first-child { border-radius: var(--radius-sm) 0 0 0; }
        thead th:last-child { border-radius: 0 var(--radius-sm) 0 0; }

        tbody tr {
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        tbody tr:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        /* Rank-based backgrounds */
        .rank-0 { background: #FEF3C7; }
        .rank-1 { background: #E5E7EB; }
        .rank-2 { background: #FFEDD5; }
        .rank-even { background: #E0F2FE; }
        .rank-odd { background: #F3E8FF; }

        .rank-0:hover { background: #FDE68A; }
        .rank-1:hover { background: #D1D5DB; }
        .rank-2:hover { background: #FDBA74; }
        .rank-even:hover { background: #BAE6FD; }
        .rank-odd:hover { background: #DDD6FE; }

        td {
          padding: 1.25rem 1.5rem;
          color: var(--text-primary);
          font-size: 1rem;
        }

        .rank-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font通信-weight: 500;
        }

        .medal {
          font-size: 1.4rem;
        }

        .name-cell { font-weight: 500; }
        .email-cell { color: var(--text-secondary); }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .leaderboard-container { margin: 1.5rem; padding: 1rem; }
          .title { font-size: 1.75rem; }
          .table-card { padding: 1.25rem; }
          .back-btn { width: 100%; }
        }
      `}</style>

      <div className="leaderboard-container" role="region" aria-labelledby="leaderboard-title">
        <div className="decor-circle decor-top"></div>
        <div className="decor-circle decor-bottom"></div>

        <button onClick={handleBack} className="back-btn" aria-label="Back to dashboard">
          Back to Dashboard
        </button>

        <h2 id="leaderboard-title" className="title">Event Registration Leaderboard</h2>

        <div className="table-card">
          {loading ? (
            <div className="status-card">Loading leaderboard...</div>
          ) : error ? (
            <div className="status-card error-card">{error}</div>
          ) : leaders.length === 0 ? (
            <div className="status-card">No leaderboard data available.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registrations</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((user, idx) => {
                  const rankClass = idx < 3 ? `rank-${idx}` : idx % 2 === 0 ? 'rank-even' : 'rank-odd';
                  return (
                    <tr key={user.userId} className={rankClass}>
                      <td className="rank-cell">
                        {idx + 1}
                        {idx < 3 && (
                          <span className="medal">
                            {idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd'}
                          </span>
                        )}
                      </td>
                      <td className="name-cell">{user.name}</td>
                      <td className="email-cell">{user.email}</td>
                      <td>{user.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Leaderboard;