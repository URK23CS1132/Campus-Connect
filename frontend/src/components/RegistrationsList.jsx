import React, { useEffect, useState } from 'react';
import { registrationAPI } from '../services/api';

function RegistrationsList({ noticeId }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    registrationAPI
      .getNoticeRegistrations(noticeId)
      .then((response) => {
        setRegistrations(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load registrations. Please try again.');
        setLoading(false);
      });
  }, [noticeId]);

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
          --border-accent: #3B82F6;
          --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
          --radius: 12px;
          --radius-sm: 8px;
          --transition: all 0.3s ease;
        }

        .registrations-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: var(--bg-gradient);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          font-family: 'Inter', sans-serif;
        }

        .registrations-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-accent);
          margin: 0 0 1.25rem 0;
          border-bottom: 2px solid var(--border-accent);
          padding-bottom: 0.5rem;
        }

        .status-card {
          text-align: center;
          padding: 1.5rem;
          border-radius: var(--radius-sm);
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          min-height: 80px;
        }

        .loading-card {
          background: #F9FAFB;
          color: var(--text-secondary);
        }

        .error-card {
          background: #FEE2E2;
          color: #B91C1C;
        }

        .empty-card {
          background: #F9FAFB;
          color: var(--text-secondary);
        }

        .table-wrapper {
          overflow-x: auto;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.5rem;
        }

        thead th {
          text-align: left;
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          background: rgba(59, 130, 246, 0.05);
          border-bottom: 2px solid var(--border-accent);
        }

        tbody tr {
          background: var(--card-bg);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        tbody tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        td {
          padding: 1rem;
          color: var(--text-primary);
          font-size: 1rem;
        }

        .name-cell {
          font-weight: 500;
        }

        .email-cell {
          color: var(--text-secondary);
        }

        /* Icons */
        .icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .registrations-container {
            margin: 1rem;
            padding: 1rem;
          }
          .registrations-title {
            font-size: 1.3rem;
          }
        }
      `}</style>

      <div className="registrations-container" role="region" aria-live="polite">
        <h4 className="registrations-title">Registrations</h4>

        {loading ? (
          <div className="status-card loading-card">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12,4V2A10,10 0 0,1 22,12H20A8,8 0 0,0 12,4Z" />
            </svg>
            Loading registrations...
          </div>
        ) : error ? (
          <div className="status-card error-card">
            <svg className="icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" />
            </svg>
            {error}
          </div>
        ) : registrations.length === 0 ? (
          <div className="status-card empty-card">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
            </svg>
            No registrations found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id}>
                    <td className="name-cell">{reg.user.name}</td>
                    <td className="email-cell">{reg.user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default RegistrationsList;