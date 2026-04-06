import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import ViewRecords from './pages/ViewRecords';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Market from './pages/Market';
import Admin from './pages/Admin';
import { storage } from './utils/storage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = storage.getUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={<Market />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/add" 
          element={
            <ProtectedRoute>
              <AddRecord />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/records" 
          element={
            <ProtectedRoute>
              <ViewRecords />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
