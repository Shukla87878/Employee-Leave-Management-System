import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LeaveRequest from './components/LeaveRequest';
import LeaveCalendar from './components/LeaveCalendar';
import Navigation from './components/Navigation';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {currentUser && <Navigation />}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/request-leave" element={currentUser ? <LeaveRequest /> : <Navigate to="/login" />} />
            <Route path="/calendar" element={currentUser ? <LeaveCalendar /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;