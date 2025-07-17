import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import UserProfile from './pages/UserProfile';
import Navigation from './components/Navigation';
import { Toaster } from './components/ui/Toaster';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Router>
        {user && <Navigation />}
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/profile/edit" element={user ? <EditProfile /> : <Navigate to="/login" />} />
          <Route path="/user/:username" element={user ? <UserProfile /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PostProvider>
          <AppContent />
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;