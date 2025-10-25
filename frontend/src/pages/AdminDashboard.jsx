import React, { useState, useEffect } from 'react';
import { noticeAPI } from '../services/api';
import RegistrationsList from '../components/RegistrationsList';

function AdminDashboard() {
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRegistrationsFor, setShowRegistrationsFor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await noticeAPI.getAll();
      setNotices(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notices');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await noticeAPI.update(editingId, formData);
        setSuccess('Notice updated successfully');
        setEditingId(null);
      } else {
        await noticeAPI.create(formData);
        setSuccess('Notice created successfully');
      }
      setFormData({ title: '', description: '', eventDate: '' });
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (notice) => {
    setFormData({
      title: notice.title,
      description: notice.description,
      eventDate: notice.eventDate.split('T')[0],
    });
    setEditingId(notice._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await noticeAPI.delete(id);
        setSuccess('Notice deleted successfully');
        fetchNotices();
      } catch (err) {
        setError('Failed to delete notice');
      }
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
          --success: #15803D;
          --danger: #B91C1C;
          --warning: #F59E0B;
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
          transition: var(--transition);
        }
        .title:hover { color: #2563eb; }

        .form-card {
          background: linear-gradient(90deg, var(--card-bg), #f9fafb);
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
          border-left: 4px solid var(--accent);
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-accent);
          margin: 0 0 1.5rem;
          border-bottom: 3px solid var(--accent);
          padding-bottom: 0.75rem;
          transition: color 0.3s ease;
        }
        .form-title:hover { color: #2563eb; }

        .alert {
          padding: 1rem 1.5rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-size: 1rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
          animation: fadeIn 0.5s ease-in;
        }
        .alert-error { background: linear-gradient(90deg, #fee2e2, #fecaca); color: var(--danger); }
        .alert-success { background: linear-gradient(90deg, #dcfce7, #bbf7d0); color: var(--success); }

        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: var(--radius-sm);
          font-size: 1rem;
          background: #f9fafb;
          transition: var(--transition);
        }
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .form-textarea { min-height: 120px; resize: vertical; }

        .btn-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        .btn-primary {
          background: linear-gradient(90deg, var(--accent), #60a5fa);
          color: white;
        }
        .btn-primary:hover { background: linear-gradient(90deg, #1e40af, var(--accent)); transform: translateY(-3px); box-shadow: var(--shadow-md); }

        .btn-secondary {
          background: linear-gradient(90deg, #6b7280, #9ca3af);
          color: white;
        }
        .btn-secondary:hover { background: linear-gradient(90deg, #4b5563, #6b7280); transform: translateY(-3px); box-shadow: var(--shadow-md); }

        .section-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-accent);
          margin: 2.5rem 0 1.5rem;
          border-bottom: 3px solid var(--accent);
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

        .notice-card {
          background: var(--card-bg);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
          border-left: 4px solid var(--accent);
          transition: var(--transition);
          position: relative;
          z-index: 1;
        }
        .notice-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }

        .notice-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.75rem;
        }
        .notice-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 0 0 1rem;
          line-height: 1.5;
        }
        .notice-meta {
          font-size: 1rem;
          color: #374151;
          margin: 0 0 0.75rem;
        }
        .notice-date {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 1rem;
        }

        .action-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-sm {
          padding: 0.6rem 1.4rem;
          font-size: 0.875rem;
        }
        .btn-edit { background: linear-gradient(90deg, var(--accent), #60a5fa); color: white; }
        .btn-edit:hover { background: linear-gradient(90deg, #1e40af, var(--accent)); transform: translateY(-3px); box-shadow: var(--shadow-md); }

        .btn-delete { background: linear-gradient(90deg, #ef4444, #f87171); color: white; }
        .btn-delete:hover { background: linear-gradient(90deg, #b91c1c, #dc2626); transform: translateY(-3px); box-shadow: var(--shadow-md); }

        .btn-view { background: linear-gradient(90deg, #fbbf24, #fcd34d); color: #1f2937; }
        .btn-view:hover { background: linear-gradient(90deg, var(--warning), #fbbf24); transform: translateY(-3px); box-shadow: var(--shadow-md); }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .dashboard { margin: 1.5rem; padding: 1rem; }
          .title { font-size: 1.875rem; }
          .form-card, .notice-card { padding: 1.25rem; }
          .btn-group, .action-btns { flex-direction: column; }
        }
      `}</style>

      <div className="dashboard" role="main" aria-labelledby="dashboard-title">
        <div className="decor-circle decor-top"></div>
        <div className="decor-circle decor-bottom"></div>

        <h1 id="dashboard-title" className="title">Admin Dashboard</h1>

        {/* Form Card */}
        <section className="form-card" aria-labelledby="form-title">
          <h2 id="form-title" className="form-title">
            {editingId ? 'Edit Notice' : 'Create New Notice'}
          </h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
                aria-label="Notice title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-input form-textarea"
                aria-label="Notice description"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="form-input"
                aria-label="Event date"
              />
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Notice' : 'Create Notice'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: '', description: '', eventDate: '' });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Notices List */}
        <h2 className="section-title">All Notices</h2>

        {loading ? (
          <div className="status-card">Loading notices...</div>
        ) : error && !notices.length ? (
          <div className="status-card alert-error">{error}</div>
        ) : notices.length === 0 ? (
          <div className="status-card">No notices found.</div>
        ) : (
          notices.map((notice) => (
            <article key={notice._id} className="notice-card">
              <h3 className="notice-title">{notice.title}</h3>
              <p className="notice-desc">{notice.description}</p>
              <p className="notice-meta">
                <strong>Event Date:</strong>{' '}
                {new Date(notice.eventDate).toLocaleDateString()}
              </p>
              <p className="notice-date">
                <small>Posted on: {new Date(notice.createdAt).toLocaleDateString()}</small>
              </p>

              <div className="action-btns">
                <button className="btn btn-edit btn-sm" onClick={() => handleEdit(notice)}>
                  Edit
                </button>
                <button className="btn btn-delete btn-sm" onClick={() => handleDelete(notice._id)}>
                  Delete
                </button>
                <button
                  className="btn btn-view btn-sm"
                  onClick={() =>
                    setShowRegistrationsFor(showRegistrationsFor === notice._id ? null : notice._id)
                  }
                >
                  {showRegistrationsFor === notice._id ? 'Hide' : 'View'} Registrations
                </button>
              </div>

              {showRegistrationsFor === notice._id && (
                <div style={{ marginTop: '2rem' }}>
                  <RegistrationsList noticeId={notice._id} />
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </>
  );
}

export default AdminDashboard;