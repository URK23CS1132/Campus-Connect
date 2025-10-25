import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Navbar from './components/Navbar';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login setUser={setUser} />
        } />
        <Route path="/signup" element={
          user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Signup setUser={setUser} />
        } />
        <Route path="/admin" element={
          user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/dashboard" element={
          user && user.role === 'user' ? <UserDashboard user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/leaderboard" element={
          user ? <Leaderboard /> : <Navigate to="/login" />
        } />
        <Route path="/" element={
          <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />
        } />
      </Routes>
    </Router>
  );
}

export default App;
